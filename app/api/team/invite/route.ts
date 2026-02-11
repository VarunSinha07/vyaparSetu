import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Verify User is Admin
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: { memberships: true },
    });

    if (!userProfile || userProfile.memberships.length === 0) {
      return new NextResponse("User profile not found", { status: 400 });
    }

    const membership = userProfile.memberships[0];

    if (membership.role !== "ADMIN") {
      return new NextResponse("Only Admins can invite members", {
        status: 403,
      });
    }

    const companyId = membership.companyId;

    // 2. Check if user is already a member (by email) -> Requires looking up User by email first
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if they are already in the company
      const existingMember = await prisma.companyMember.findFirst({
        where: {
          companyId,
          user: {
            userId: existingUser.id,
          },
        },
      });

      if (existingMember) {
        return new NextResponse("User is already a member of this company", {
          status: 409,
        });
      }
    }

    // 3. Create Invitation
    // Generate a unique token
    const token = randomUUID().replace(/-/g, ""); // Simple clean token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.invitation.create({
      data: {
        companyId,
        email,
        role: role as CompanyRole,
        token,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/invite/${token}`;

    await sendEmail({
      to: email,
      subject: "Invitation to join VyaparFlow",
      text: `You have been invited to join the team on VyaparFlow. Click the link to accept: ${inviteLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Welcome to VyaparFlow</h2>
          <p style="color: #555;">You have been invited to join the team.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p style="color: #888; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #4F46E5; font-size: 14px;">${inviteLink}</p>
          <p style="color: #aaa; font-size: 12px; margin-top: 40px;">This link will expire in 7 days.</p>
        </div>
      `,
    });

    console.log(`Invitation sent to ${email}: Token ${token}`);

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Failed to invite member", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
