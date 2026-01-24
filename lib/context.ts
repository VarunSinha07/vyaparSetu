import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AppContext = {
  userId: string; // Auth User ID
  profileId: string; // UserProfile ID
  companyId: string | null;
  role: string | null;
  user: typeof auth.$Infer.Session.user; // Better auth user
  session: typeof auth.$Infer.Session.session;
};

export async function getContext(options?: {
  ensureCompany?: boolean;
}): Promise<AppContext | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Step 1: Ensure User Profile
  const user = session.user;

  // We try to fetch the profile.
  let profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    include: { memberships: true },
  });

  // ... [create logic if missing] ...

  if (!profile) {
    try {
      profile = await prisma.userProfile.create({
        data: {
          userId: user.id,
          name: user.name,
        },
        include: { memberships: true },
      });
    } catch (error) {
      // Handle race condition if parallel requests try to create profile
      profile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
        include: { memberships: true },
      });

      if (!profile) throw error;
    }
  }

  // Step 4: Resolve Company Context
  const activeMembership =
    profile.memberships.find((m) => m.isActive) || profile.memberships[0];

  const context: AppContext = {
    userId: user.id,
    profileId: profile.id,
    companyId: activeMembership?.companyId || null,
    role: activeMembership?.role || null, // ADMIN, PROCUREMENT, etc.
    user: user,
    session: session.session,
  };

  if (options?.ensureCompany && !context.companyId) {
    // Step 2 Redirect Logic
    redirect("/create-company");
  }

  return context;
}
