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
      <p>&copy; ${new Date().getFullYear()} VyaparSetu Finance. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
}
