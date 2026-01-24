import { getContext } from "@/lib/context";
import { requireRole } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextResponse } from "next/server";
import { CompanyRole } from "@/app/generated/prisma/client";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const context = await getContext({ ensureCompany: true });
    if (!context)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Step 5: RBAC
    try {
      requireRole(context, [CompanyRole.ADMIN]);
    } catch {
      return NextResponse.json(
        { error: "Forbidden: Only Admins can invite" },
        { status: 403 },
      );
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and Role required" },
        { status: 400 },
      );
    }

    // Check if user exists (in Auth DB)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if they are in ANY company
      const membership = await prisma.companyMember.findFirst({
        where: { userId: existingUser.id },
      });

      if (membership) {
        return NextResponse.json(
          { error: "User already exists in a company." },
          { status: 400 },
        );
      }
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Step 6: Create Invitation
    const invitation = await prisma.invitation.create({
      data: {
        companyId: context.companyId!,
        email,
        role: role as CompanyRole,
        token,
        expiresAt,
      },
    });

    // Step 8: Audit
    await logAudit({
      companyId: context.companyId!,
      userId: context.profileId,
      action: "INVITE_USER",
      entity: "Invitation",
      entityId: invitation.id,
      metadata: { email, role },
    });

    // Send Email
    const baseUrl =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const inviteUrl = `${baseUrl}/invite/${token}`;

    await sendEmail({
      to: email,
      subject: "You have been invited to join VyaparFlow",
      text: `You have been invited to join a company on VyaparFlow.\n\nClick here to accept: ${inviteUrl}`,
      html: `<p>You have been invited to join a company on VyaparFlow.</p><p><a href="${inviteUrl}">Click here to accept</a></p>`,
    });

    return NextResponse.json({ message: "Invitation sent", token });

  } catch (error: unknown) {
    console.error("Invite Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
