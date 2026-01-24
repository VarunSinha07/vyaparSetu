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
      html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join the Team</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; color: #1f2937;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">VyaparFlow</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #e0e7ff; border-radius: 50%; margin-bottom: 24px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
                <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">You've been invited to join!</h2>
                <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                    You have been invited to join the team workspace on <strong>VyaparFlow</strong>. Collaboration is just a click away.
                </p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${inviteUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px; transition: background-color 0.2s;">
                    Accept Invitation
                </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    <strong>Link not working?</strong> Copy and paste this URL into your browser:
                </p>
                <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all;">
                    <a href="${inviteUrl}" style="color: #4f46e5; font-size: 14px; text-decoration: none;">${inviteUrl}</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                &copy; ${new Date().getFullYear()} VyaparFlow. All rights reserved.
            </p>
            <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                If you were not expecting this invitation, you can safely ignore this email.
            </p>
        </div>
    </div>
</body>
</html>`,
    });

    return NextResponse.json({ message: "Invitation sent", token });
  } catch (error: unknown) {
    console.error("Invite Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
