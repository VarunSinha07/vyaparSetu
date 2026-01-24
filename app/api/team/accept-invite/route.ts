import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, password, name } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Validate Invite
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (
      !invitation ||
      invitation.expiresAt < new Date() ||
      invitation.acceptedAt
    ) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 },
      );
    }

    // Check if User exists
    let user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    // New User Creation Logic
    if (!user) {
      if (!password || !name) {
        return NextResponse.json(
          { error: "Name and Password are required for new users" },
          { status: 400 },
        );
      }

      // Use Better-Auth to create user
      const signUpResponse = await auth.api.signUpEmail({
        body: {
          email: invitation.email,
          password,
          name,
        },
      });

      if (!signUpResponse?.user) {
        throw new Error("Failed to create user");
      }

      user = await prisma.user.findUnique({
        where: { id: signUpResponse.user.id },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "User resolution failed" },
        { status: 500 },
      );
    }

    // Check if already member
    const existingMember = await prisma.companyMember.findFirst({
      where: { userId: user.id },
    });

    if (existingMember) {
      // Should technically be caught by UI or Invite creation, but just in case
      // If they are in another company, this invite is effectively void unless we support multi-company (which we don't yet for typical users?)
      // For now, fail safely
      if (existingMember.companyId !== invitation.companyId) {
        return NextResponse.json(
          { error: "User is already a member of another company." },
          { status: 400 },
        );
      }
      // If same company, just mark accepted if not already
      if (invitation.acceptedAt) {
        return NextResponse.json({ success: true, message: "Already joined" });
      }
    }

    // Add Member & Close Invite
    await prisma.$transaction(async (tx) => {
      // 1. Ensure UserProfile exists (if creating new user via better-auth, profile might not exist depending on hook, but we need one)
      // Better-Auth creates 'User' and 'Account'. We have 'UserProfile'.
      // If we just created the user, we need to create the profile.
      // If user existed, check profile.

      const existingProfile = await tx.userProfile.findUnique({
        where: { userId: user!.id },
      });

      if (!existingProfile) {
        await tx.userProfile.create({
          data: {
            userId: user!.id,
            name: name || user!.name || "User",
          },
        });
      }

      // 2. Create Company Member
      await tx.companyMember.create({
        data: {
          companyId: invitation.companyId,
          userId: user!.id,
          role: invitation.role,
        },
      });

      // 3. Update Invitation
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      });
    });

    // Audit
    await logAudit({
      companyId: invitation.companyId,
      userId: user.id, // We don't have a session ID here necessarily properly set if they aren't logged in, but we know WHO it is.
      // Wait, logAudit usually expects authorized user ID.
      // In this case, the Action Performer is the User themselves (accepting invite).
      // We can look up their profile ID.
      action: "JOIN_COMPANY",
      entity: "Invitation",
      entityId: invitation.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Accept Invite Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
