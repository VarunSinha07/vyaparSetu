import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generatePasswordResetEmail } from "@/lib/email-templates";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const resetLink = url.startsWith("http")
        ? url
        : `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}${url}`;

      console.log(`[AUTH] Password reset requested for ${user.email}`);
      console.log(`[AUTH] Reset Link: ${resetLink}`);

      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your VyaparFlow password",
          text: `Hello ${user.name || "there"},\n\nWe received a request to reset your password for VyaparFlow.\n\nPlease visit the link below to set a new password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you did not request this, you can safely ignore this email.`,
          html: generatePasswordResetEmail({
            userName: user.name,
            userEmail: user.email,
            resetLink,
          }),
        });
        console.log(`[AUTH] Password reset email successfully sent to ${user.email}`);
      } catch (emailError) {
        console.error(`[AUTH] Failed to dispatch email to ${user.email}:`, emailError);
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
