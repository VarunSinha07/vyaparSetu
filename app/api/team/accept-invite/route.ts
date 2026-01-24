import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, name } = await req.json();

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

    // Check if User exists (Frontend should have ensured this via signUp)
    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found. Please sign up first." },
        { status: 400 },
      );
    }

    // Check if already member
    const existingMember = await prisma.companyMember.findFirst({
      where: { userId: user.id },
    });

    if (existingMember) {
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
    const userProfileId = await prisma.$transaction(async (tx) => {
      // 1. Ensure UserProfile exists
      let profile = await tx.userProfile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        profile = await tx.userProfile.create({
          data: {
            userId: user.id,
            name: name || user.name || "User",
          },
        });
      }

      // 2. Create Company Member
      await tx.companyMember.create({
        data: {
          companyId: invitation.companyId,
          userId: user.id,
          role: invitation.role,
        },
      });

      // 3. Update Invitation
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      });

      return profile.id;
    });

    // Audit
    await logAudit({
      companyId: invitation.companyId,
      userId: userProfileId,
      action: "JOIN_COMPANY",
      entity: "Invitation",
      entityId: invitation.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Accept Invite Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
