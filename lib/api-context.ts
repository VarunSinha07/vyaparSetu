import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";

export type AuthenticatedContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  userProfile: {
    id: string;
    userId: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  companyId: string | null;
  role: CompanyRole | null;
};

export class AuthError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getAuthenticatedUserContext(): Promise<AuthenticatedContext> {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) {
    throw new AuthError(401, "Unauthorized");
  }

  // Step 2: Create UserProfile on First Login
  let userProfile = await prisma.userProfile.findUnique({
    where: { userId: sessionData.user.id },
  });

  if (!userProfile) {
    try {
      userProfile = await prisma.userProfile.create({
        data: {
          userId: sessionData.user.id,
          name: sessionData.user.name,
        },
      });
    } catch {
      // Handle race condition if multiple requests come in at once
      userProfile = await prisma.userProfile.findUnique({
        where: { userId: sessionData.user.id },
      });
      if (!userProfile)
        throw new AuthError(500, "Failed to create user profile");
    }
  }

  // Step 4: Resolve Company Context
  const membership = await prisma.companyMember.findFirst({
    where: { userId: userProfile.id },
    select: { companyId: true, role: true },
  });

  return {
    session: sessionData.session,
    user: sessionData.user,
    userProfile,
    companyId: membership?.companyId ?? null,
    role: membership?.role ?? null,
  };
}

export function assertPermission(
  ctx: AuthenticatedContext,
  requiredRoles: CompanyRole[] = [],
) {
  if (!ctx.companyId) {
    throw new AuthError(403, "Forbidden: No company assigned");
  }

  if (requiredRoles.length > 0) {
    if (!ctx.role || !requiredRoles.includes(ctx.role)) {
      throw new AuthError(403, "Forbidden: Insufficient permissions");
    }
  }
}

// Step 7: Centralize Secure API Pattern
export function secureApi(
  handler: (req: Request, ctx: AuthenticatedContext) => Promise<NextResponse>,
) {
  return async (req: Request) => {
    try {
      const ctx = await getAuthenticatedUserContext();
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.code },
        );
      }
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
