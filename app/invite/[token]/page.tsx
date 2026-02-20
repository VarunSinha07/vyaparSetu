import prisma from "@/lib/prisma";
import InviteForm from "./invite-form";
import { notFound } from "next/navigation";
import {
  XCircle,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

interface StatusCardProps {
  icon: React.ElementType;
  title: string;
  message: string;
  linkText?: string;
  linkHref?: string;
  variant?: "success" | "error" | "info";
}

const StatusCard = ({
  icon: Icon,
  title,
  message,
  linkText,
  linkHref,
  variant = "info",
}: StatusCardProps) => {
  const colors = {
    success: {
      bg: "bg-emerald-50 text-emerald-600",
      text: "text-emerald-900",
      button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    },
    error: {
      bg: "bg-red-50 text-red-600",
      text: "text-red-900",
      button: "bg-red-600 hover:bg-red-700 shadow-red-500/20",
    },
    info: {
      bg: "bg-blue-50 text-blue-600",
      text: "text-blue-900",
      button: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
    },
  };

  const theme = colors[variant];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200 text-center p-10 animate-in fade-in zoom-in-95 duration-300">
        <div
          className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${theme.bg}`}
        >
          <Icon className="w-10 h-10" />
        </div>
        <h1 className={`text-2xl font-bold ${theme.text} mb-3`}>{title}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">
          {message}
        </p>
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:-translate-y-0.5 ${theme.button}`}
          >
            {linkText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

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
        variant="error"
        title="Invitation Expired"
        message="This invitation link is no longer valid. Please invite request a new one."
      />
    );
  }

  if (invitation.acceptedAt) {
    return (
      <StatusCard
        icon={CheckCircle}
        variant="success"
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
          variant="info"
          title="Already a Member"
          message={`You are already a member of ${invitation.company.name}.`}
          linkText="Go to Dashboard"
          linkHref="/dashboard"
        />
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#009688] font-sans relative">
      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500 m-4">
        {/* Content */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 ring-1 ring-white/30 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight drop-shadow-sm">
            Join the Team
          </h2>
          <p className="text-emerald-50 text-sm font-medium mb-5">
            You&apos;ve been invited to join
            <span className="font-bold text-white ml-1">
              {invitation.company.name}
            </span>
          </p>

          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
            <span className="text-xs font-bold text-white tracking-widest uppercase">
              ROLE: {invitation.role}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-emerald-900/20 ring-1 ring-black/5">
          <InviteForm
            token={token}
            email={invitation.email}
            isExistingUser={!!existingUser}
          />
        </div>

        <p className="text-center text-xs text-emerald-100/60 mt-8 font-medium">
          &copy; {new Date().getFullYear()} VyaparFlow. Secure invitation
          system.
        </p>
      </div>
    </div>
  );
}
