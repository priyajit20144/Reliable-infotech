import nodemailer from 'nodemailer';

export const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_KEY = process.env.SMTP_KEY || '';
export const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '';
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'DevCraft Platform';

export const isSmtpConfigured = (): boolean => {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_KEY && !SMTP_KEY.includes('your_brevo'));
};


/**
 * Brevo (Sendinblue) Transactional SMTP Transporter
 */
export const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // port 587 uses STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Verifies SMTP connectivity with Brevo relay server
 */
export const verifySmtpConnection = async (): Promise<{
  configured: boolean;
  connected: boolean;
  host: string;
  port: number;
  user: string;
  message: string;
  error?: string;
}> => {
  if (!isSmtpConfigured()) {
    return {
      configured: false,
      connected: false,
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      message: 'Brevo SMTP credentials are not fully configured.',
    };
  }

  try {
    await mailTransporter.verify();
    return {
      configured: true,
      connected: true,
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      message: 'Connected to Brevo SMTP Relay successfully! Ready to send emails.',
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP verification failed';
    return {
      configured: true,
      connected: false,
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      message: `Brevo SMTP verification error: ${errorMsg}`,
      error: errorMsg,
    };
  }
};

/**
 * Generic safe mail sender with HTML styling & fallback handling
 */
export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  if (!isSmtpConfigured()) {
    console.warn('[EmailService] SMTP not configured. Skipped sending email to:', options.to);
    return { success: false, error: 'SMTP credentials not configured.' };
  }

  try {
    const info = await mailTransporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
      replyTo: options.replyTo,
    });

    console.log(`[EmailService] Email dispatched successfully to ${options.to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.warn(`[EmailService] Failed to send email to ${options.to}:`, err?.message);
    return { success: false, error: err?.message || 'Failed to dispatch email' };
  }
};

/**
 * Transactional: Welcome Email on Registration
 */
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; margin: 0;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
        <div style="margin-bottom: 24px; text-align: center;">
          <h1 style="color: #6366f1; margin: 0; font-size: 24px; font-weight: 800;">DevCraft</h1>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Ideas to Digital Reality</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 0;">Welcome aboard, ${userName}!</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Your DevCraft Client Workspace has been successfully provisioned. You can now commission custom web applications, track real-time delivery milestones, and communicate directly with lead architects.
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <a href="http://localhost:5173/dashboard" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
            Open Client Workspace &rarr;
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
        <p style="color: #64748b; font-size: 11px; margin: 0; text-align: center;">
          Dispatched via Brevo Transactional SMTP relay &bull; DevCraft Platform
        </p>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: userEmail,
    subject: 'Welcome to DevCraft — Your Client Workspace is Active',
    html,
  });
};

/**
 * Transactional: Contact Form Notification & Confirmation
 */
export const sendContactNotification = async (contact: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const adminHtml = `
    <div style="font-family: sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 28px;">
        <h2 style="color: #38bdf8; margin-top: 0;">New Inbound Contact Form Submission</h2>
        <p style="color: #cbd5e1; font-size: 14px;"><strong>From:</strong> ${contact.name} (${contact.email})</p>
        <p style="color: #cbd5e1; font-size: 14px;"><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
        <p style="color: #cbd5e1; font-size: 14px;"><strong>Subject:</strong> ${contact.subject || 'General Inquiry'}</p>
        <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #f1f5f9; font-size: 13px; line-height: 1.5; margin: 0;">${contact.message}</p>
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: SMTP_FROM_EMAIL,
    replyTo: contact.email,
    subject: `[DevCraft Inquiry] ${contact.subject || 'New Contact'} from ${contact.name}`,
    html: adminHtml,
  });
};

/**
 * Transactional: Custom Website Request Confirmation
 */
export const sendCustomRequestConfirmation = async (request: {
  name: string;
  email: string;
  websiteType: string;
  budgetMin: number;
  budgetMax: number;
  description: string;
}) => {
  const html = `
    <div style="font-family: sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 28px;">
        <h2 style="color: #818cf8; margin-top: 0;">We've received your Custom Website Request!</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
          Hello ${request.name}, thank you for submitting your custom website specification to DevCraft. Our engineering leads are analyzing your architecture requirements.
        </p>
        <div style="background-color: #0b0f19; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px 0;">PROJECT TYPE</p>
          <p style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">${request.websiteType}</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px 0;">BUDGET ESTIMATE</p>
          <p style="color: #34d399; font-size: 14px; font-weight: 600; margin: 0;">$${request.budgetMin} &ndash; $${request.budgetMax}</p>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">Our team will review your proposal and reply within 24 hours.</p>
      </div>
    </div>
  `;

  return sendMail({
    to: request.email,
    subject: `[DevCraft] We've received your request: ${request.websiteType}`,
    html,
  });
};
