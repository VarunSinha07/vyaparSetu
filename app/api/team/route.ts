import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Get current UserProfile to find Company
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        memberships: true,
      },
    });

    if (!userProfile || userProfile.memberships.length === 0) {
      return new NextResponse("User does not belong to any company", {
        status: 400,
      });
    }

    const companyId = userProfile.memberships[0].companyId;
    const currentUserRole = userProfile.memberships[0].role;

    // 2. Fetch Company Details, Members, and Invitations
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        members: {
          include: {
            user: true, // This is UserProfile
          },
        },
        invitations: {
          where: {
            acceptedAt: null,
            expiresAt: { gt: new Date() },
          },
        },
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // 3. Fetch Emails from Auth User table
    // distinct userIds from members
    const userIds = company.members.map((m) => m.user.userId);

    // Check if we can find users by ID. The 'User' model is 'user' in prisma (mapped).
    const authUsers = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        email: true,
        image: true,
      },
    });

    // 4. Merge Data
    const membersWithDetails = company.members.map((member) => {
      const authUser = authUsers.find((u) => u.id === member.user.userId);
      return {
        id: member.id,
        role: member.role,
        isActive: member.isActive,
        joinedAt: member.createdAt,
        profile: member.user,
        email: authUser?.email || "Unknown",
        image: authUser?.image,
        isCurrentUser: member.user.userId === session.user.id,
      };
    });

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
      },
      members: membersWithDetails,
      invitations: company.invitations,
      currentUserRole,
    });
  } catch (error) {
    console.error("Failed to fetch team", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
