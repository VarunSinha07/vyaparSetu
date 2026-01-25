import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { randomUUID } from "crypto";

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

    // TODO: Send Email with link: /join?token=...
    console.log(`Invitation created for ${email}: Token ${token}`);

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Failed to invite member", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
