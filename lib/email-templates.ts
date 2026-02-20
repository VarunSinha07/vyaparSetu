export function generatePaymentSuccessEmail(data: {
  vendorName: string;
  amount: number;
  invoiceNumber: string;
  paymentDate: string;
  transactionId: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #4f46e5; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .success-icon { text-align: center; margin-bottom: 20px; }
    .amount-box { background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #e5e7eb; }
    .amount-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .amount-value { font-size: 32px; font-weight: 700; color: #111827; margin-top: 5px; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .label { color: #6b7280; width: 40%; }
    .value { color: #111827; font-weight: 500; text-align: right; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Successful</h1>
    </div>
    <div class="content">
      <div class="success-icon">
        <div style="font-size: 48px;">✅</div>
      </div>
      
      <p>Dear <strong>${data.vendorName}</strong>,</p>
      <p>We are pleased to inform you that a payment has been successfully processed for your invoice.</p>
      
      <div class="amount-box">
        <div class="amount-label">Amount Paid</div>
        <div class="amount-value">Rs. ${data.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Invoice Number</td>
          <td class="value">#${data.invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">Transaction ID</td>
          <td class="value">${data.transactionId}</td>
        </tr>
        <tr>
          <td class="label">Payment Date</td>
          <td class="value">${data.paymentDate}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        📎 A formal payment receipt is attached to this email for your records.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} VyaparFlow Finance. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateCompanyInviteEmail(data: {
  companyName: string;
  inviterName: string;
  role: string;
  inviteLink: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; background-color: #ffffff; }
    .welcome-text { font-size: 18px; color: #111827; margin-bottom: 24px; line-height: 1.6; }
    .inviter-info { background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
    .inviter-name { font-weight: 700; color: #065f46; font-size: 16px; }
    .company-name { font-weight: 600; color: #059669; }
    .role-badge { display: inline-block; background-color: #ecfdf5; color: #047857; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; border: 1px solid #a7f3d0; }
    .cta-container { text-align: center; margin: 35px 0; }
    .cta-button { background-color: #059669; color: #ffffff !important; padding: 16px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3); transition: background-color 0.2s; }
    .cta-button:hover { background-color: #047857; }
    .link-backup { margin-top: 30px; font-size: 13px; color: #6b7280; word-break: break-all; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; }
    .link-backup a { color: #059669; text-decoration: none; }
    .footer { background-color: #f9fafb; padding: 30px 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    .social-links { margin-bottom: 20px; }
    .expiry-note { font-size: 12px; color: #ef4444; margin-top: 10px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VyaparFlow</h1>
    </div>
    <div class="content">
      <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Join the team!</h2>
      
      <p class="welcome-text">
        Hello! You've been invited to collaborate on <strong>VyaparFlow</strong>.
      </p>

      <div class="inviter-info">
        <div style="font-size: 14px; color: #4b5563; margin-bottom: 4px;">Invited by</div>
        <div class="inviter-name">${data.inviterName}</div>
        <div style="margin-top: 12px; font-size: 14px; color: #4b5563; margin-bottom: 4px;">Organization</div>
        <div class="company-name">${data.companyName}</div>
        <div style="margin-top: 12px;">
           <span class="role-badge">${data.role}</span>
        </div>
      </div>

      <div class="cta-container">
        <a href="${data.inviteLink}" class="cta-button">Accept Invitation</a>
      </div>

      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Accepting this invitation will give you access to the company's workspace based on your assigned role.
      </p>

      <div class="link-backup">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <a href="${data.inviteLink}">${data.inviteLink}</a>
        <p class="expiry-note">This invitation will expire in 7 days.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} VyaparFlow. All rights reserved.</p>
      <p>Streamline your vendor & procurement operations.</p>
    </div>
  </div>
</body>
</html>
  `;
}
