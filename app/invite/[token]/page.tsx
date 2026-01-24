import prisma from "@/lib/prisma";
import InviteForm from "./invite-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { company: true },
  });

  if (!invitation) return notFound();

  if (invitation.expiresAt < new Date()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invitation Expired
          </h1>
          <p>Please ask the administrator to send a new invitation.</p>
        </div>
      </div>
    );
  }

  if (invitation.acceptedAt) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">
            Already Accepted
          </h1>
          <p>You have already joined the company.</p>
          <a href="/sign-in" className="mt-4 text-blue-500 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  // Also check if they are already in THIS company (double check)
  if (existingUser) {
    const existingMember = await prisma.companyMember.findFirst({
      where: {
        userId: existingUser.id,
        companyId: invitation.companyId,
      },
    });

    if (existingMember) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Already a Member
            </h1>
            <p>You are already a member of {invitation.company.name}.</p>
            <a href="/dashboard" className="mt-4 text-blue-500 hover:underline">
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 bg-[url('/grid-pattern.svg')] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
        {/* Header with decorative background */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <div
            className="absolute inset-0 bg-white/10 opacity-30"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          ></div>
          <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Join {invitation.company.name}
          </h2>
          <p className="relative mt-2 text-blue-100">
            You&apos;ve been invited to join as{" "}
            <span className="font-semibold text-white capitalize">
              {invitation.role.toLowerCase()}
            </span>
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <InviteForm
            token={token}
            email={invitation.email}
            isExistingUser={!!existingUser}
          />
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 border-t border-gray-100">
          Powered by VyaparFlow
        </div>
      </div>
    </div>
  );
}
