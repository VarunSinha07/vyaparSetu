import nodemailer from "nodemailer";

const transportOptions = {
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: process.env.EMAIL_SERVER_USER
    ? {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      }
    : undefined,
};

const transporter = nodemailer.createTransport(transportOptions);

export async function sendEmail({
  to,
  cc,
  subject,
  text,
  html,
  attachments,
}: {
  to: string;
  cc?: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}) {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.log("[EMAIL MOCK]", {
      to,
      cc,
      subject,
      text,
      hasAttachments: !!attachments,
    });
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"VyaparSetu" <noreply@vyaparsetu.com>',
      to,
      cc,
      subject,
      text,
      html,
      attachments,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
