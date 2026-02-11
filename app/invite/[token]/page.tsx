import prisma from "@/lib/prisma";
import InviteForm from "./invite-form";
import { notFound } from "next/navigation";
import {
  Building2,
  XCircle,
  CheckCircle,
  ShieldCheck,
  Mail,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

interface StatusCardProps {
  icon: React.ElementType;
  color: string;
  title: string;
  message: string;
  linkText?: string;
  linkHref?: string;
}

// Helper for Status Screens
const StatusCard = ({
  icon: Icon,
  color,
  title,
  message,
  linkText,
  linkHref,
}: StatusCardProps) => (
  <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 font-sans">
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 text-center p-12">
      <div
        className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-${color}-50`}
      >
        <Icon className={`w-10 h-10 text-${color}-600`} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>
      {linkText && (
        <a
          href={linkHref}
          className={`inline-flex px-6 py-3 rounded-xl bg-${color}-600 text-white font-semibold hover:bg-${color}-700 transition-colors shadow-lg shadow-${color}-600/30`}
        >
          {linkText}
        </a>
      )}
    </div>
  </div>
);

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { company: true },
  });

  if (!invitation) return notFound();

  if (invitation.expiresAt < new Date()) {
    return (
      <StatusCard
        icon={XCircle}
        color="red"
        title="Invitation Expired"
        message="This invitation link is no longer valid. Please ask your administrator to send a new one."
      />
    );
  }

  if (invitation.acceptedAt) {
    return (
      <StatusCard
        icon={CheckCircle}
        color="emerald"
        title="Already Accepted"
        message="You have already joined the company using this invitation."
        linkText="Go to Login"
        linkHref="/sign-in"
      />
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  // Also check if they are already in THIS company
  if (existingUser) {
    const existingMember = await prisma.companyMember.findFirst({
      where: {
        userId: existingUser.id,
        companyId: invitation.companyId,
      },
    });

    if (existingMember) {
      return (
        <StatusCard
          icon={ShieldCheck}
          color="blue"
          title="Already a Member"
          message={`You are already a member of ${invitation.company.name}.`}
          linkText="Go to Dashboard"
          linkHref="/dashboard"
        />
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-600/10 flex items-center gap-2 ring-1 ring-gray-100">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">VyaparSetu</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-slate-900 px-8 py-10 text-center">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-600 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/20 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                Start collaborating with
              </h2>
              <h3 className="text-xl font-medium text-indigo-200">
                {invitation.company.name}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 bg-white">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 uppercase tracking-wide">
                Invited as {invitation.role}
              </span>
            </div>

            <InviteForm
              token={token}
              email={invitation.email}
              isExistingUser={!!existingUser}
            />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Secure invitation powered by VyaparSetu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
