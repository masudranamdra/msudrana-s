import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactNotification = async (
  senderName: string,
  senderEmail: string,
  subject: string,
  messageContent: string
): Promise<void> => {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    console.warn('ADMIN_EMAILS not specified in .env. Skipping email notification.');
    return;
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.warn('EMAIL_USER or EMAIL_PASS not configured. Skipping email notification.');
    return;
  }

  const mailOptions = {
    from: `"Portfolio SaaS Platform" <${emailUser}>`,
    to: adminEmails,
    subject: `[Portfolio SaaS Contact] ${subject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #4f46e5; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Message from Portfolio SaaS</h2>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 15px 0; border-radius: 4px;">
          ${messageContent.replace(/\n/g, '<br>')}
        </div>
        <p style="font-size: 0.85em; color: #6b7280; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
          This message was sent automatically from your Portfolio SaaS Dashboard.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact form notification email sent to: ${adminEmails}`);
  } catch (error: any) {
    console.error(`Failed to send contact notification email: ${error.message}`);
  }
};
