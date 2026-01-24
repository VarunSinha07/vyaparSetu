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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join {invitation.company.name}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You have been invited as <strong>{invitation.role}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <InviteForm
            token={token}
            email={invitation.email}
            isExistingUser={!!existingUser}
          />
        </div>
      </div>
    </div>
  );
}
