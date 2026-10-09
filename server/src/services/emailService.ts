import nodemailer from 'nodemailer';
import { sendBrevoTransactionalEmail, isBrevoApiConfigured } from './brevoService.js';

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

export const GMAIL_USER = process.env.GMAIL_USER || '';
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

export const isGmailConfigured = (): boolean => {
  const user = GMAIL_USER || (SMTP_HOST.includes('gmail') ? SMTP_USER : '');
  const pass = GMAIL_APP_PASSWORD || (SMTP_HOST.includes('gmail') ? SMTP_KEY : '');
  return Boolean(user && pass && !pass.includes('your_app_password'));
};

/**
 * Direct Google Gmail SMTP Transporter (Port 465 SSL or standard Gmail service)
 * Direct delivery to any valid Gmail inbox with zero IP whitelisting hurdles
 */
export const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER || SMTP_USER,
    pass: GMAIL_APP_PASSWORD || SMTP_KEY,
  },
});

/**
 * Verifies Gmail SMTP connectivity
 */
export const verifyGmailConnection = async (): Promise<{
  configured: boolean;
  connected: boolean;
  user: string;
  message: string;
  error?: string;
}> => {
  if (!isGmailConfigured()) {
    return {
      configured: false,
      connected: false,
      user: GMAIL_USER || '',
      message: 'Gmail SMTP is not configured in environment variables (GMAIL_USER, GMAIL_APP_PASSWORD).',
    };
  }

  try {
    await gmailTransporter.verify();
    return {
      configured: true,
      connected: true,
      user: GMAIL_USER || SMTP_USER,
      message: 'Connected to Gmail SMTP Relay successfully! Ready to deliver directly to inboxes.',
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Gmail verification failed';
    return {
      configured: true,
      connected: false,
      user: GMAIL_USER || SMTP_USER,
      message: `Gmail SMTP verification error: ${errorMsg}`,
      error: errorMsg,
    };
  }
};

/**
 * Generic safe mail sender with Multi-Provider Priority:
 * Priority 1: Direct Gmail SMTP (delivers straight to valid Gmail inboxes without IP blocks)
 * Priority 2: Brevo Transactional SMTP Relay (smtp-relay.brevo.com:587)
 * Priority 3: Brevo REST API v3 (/smtp/email)
 */
export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string; via?: string }> => {
  // Strategy 1: Direct Gmail SMTP (Highest reliability for real Gmail inboxes)
  if (isGmailConfigured()) {
    try {
      const fromEmail = GMAIL_USER || (SMTP_USER.includes('@gmail.com') ? SMTP_USER : SMTP_FROM_EMAIL);
      const info = await gmailTransporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
        replyTo: options.replyTo,
      });

      console.log(`[EmailService] Direct Gmail SMTP dispatched to ${options.to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, via: 'gmail-smtp' };
    } catch (gmailErr: any) {
      console.warn(`[EmailService] Gmail SMTP send failed (${gmailErr?.message}), trying secondary fallbacks...`);
    }
  }

  // Strategy 2: Attempt Brevo SMTP Relay
  if (isSmtpConfigured()) {
    try {
      const info = await mailTransporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
        replyTo: options.replyTo,
      });

      console.log(`[EmailService] Brevo SMTP email dispatched to ${options.to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, via: 'brevo-smtp' };
    } catch (smtpErr: any) {
      console.warn(`[EmailService] Brevo SMTP send failed (${smtpErr?.message}), trying Brevo REST API fallback...`);
    }
  }

  // Strategy 3: Attempt Brevo REST API v3
  if (isBrevoApiConfigured()) {
    try {
      const restResult = await sendBrevoTransactionalEmail({
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text,
        replyTo: options.replyTo ? { email: options.replyTo, name: 'Client' } : undefined,
      });

      const messageId = restResult?.messageId || `brevo_api_${Date.now()}`;
      console.log(`[EmailService] Brevo REST API email dispatched to ${options.to} (MessageId: ${messageId})`);
      return { success: true, messageId, via: 'brevo-rest-api' };
    } catch (restErr: any) {
      console.warn(`[EmailService] Brevo REST API failed for ${options.to}:`, restErr?.message);
      return { success: false, error: restErr?.message || 'Email delivery failed across all providers.' };
    }
  }

  console.warn('[EmailService] No active email provider (Gmail, Brevo SMTP, or Brevo REST API) is configured.');
  return { success: false, error: 'Email service credentials not configured.' };
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

/**
 * Transactional: 6-Digit Password Reset OTP Email
 */
export const sendPasswordResetOtpEmail = async (
  userEmail: string,
  userName: string,
  otpCode: string
) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>DevCraft Password Reset Verification</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; margin: 0; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <!-- Header / Logo -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background: linear-gradient(135deg, #06b6d4, #6366f1, #a855f7); color: #ffffff; font-weight: 800; font-size: 20px;">
            &lt;/&gt;
          </div>
          <h1 style="color: #ffffff; margin: 12px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">DevCraft</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Cloud & Web Engineering</p>
        </div>

        <!-- Notification Title -->
        <h2 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 12px 0; text-align: center;">
          Password Reset Verification
        </h2>
        
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello <strong style="color: #ffffff;">${userName || 'DevCraft User'}</strong>,
        </p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          We received a request to reset the password for your DevCraft account (<span style="color: #818cf8; font-family: monospace;">${userEmail}</span>). Please use the 6-digit verification code below to authorize your password update:
        </p>

        <!-- OTP Code Card -->
        <div style="text-align: center; margin: 28px 0; background: #0b0f19; border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 14px; padding: 24px 16px;">
          <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600;">
            One-Time Verification Code (OTP)
          </div>
          <div style="font-family: 'SF Mono', 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #60a5fa; text-shadow: 0 0 20px rgba(96, 165, 250, 0.4); margin-left: 12px;">
            ${otpCode}
          </div>
          <div style="color: #f59e0b; font-size: 12px; margin-top: 12px; font-weight: 500;">
            &#9201; Expires in 10 minutes &bull; Single-use only
          </div>
        </div>

        <!-- Security Warning & Instructions -->
        <div style="background-color: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; border-radius: 6px; padding: 12px 16px; margin: 20px 0;">
          <p style="color: #fca5a5; font-size: 12px; line-height: 1.5; margin: 0;">
            <strong>Security Notice:</strong> Never share this verification code with anyone. DevCraft engineers will never ask for your one-time passwords.
          </p>
        </div>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 20px 0 0 0;">
          If you did not initiate this password reset request, you can safely ignore this email. Your existing account credentials remain fully secure.
        </p>

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 28px 0 20px 0;" />

        <!-- Footer -->
        <p style="color: #64748b; font-size: 11px; margin: 0; text-align: center; line-height: 1.5;">
          Dispatched via Brevo Transactional Relay &bull; DevCraft Security Operations<br />
          &copy; ${new Date().getFullYear()} DevCraft Platform. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: userEmail,
    subject: `[DevCraft] ${otpCode} is your Password Reset Verification Code`,
    html,
    text: `Your DevCraft password reset verification code is: ${otpCode}. This code is valid for 10 minutes. If you did not request this, please ignore this email.`,
  });
};

/**
 * Transactional: Password Successfully Reset Confirmation
 */
export const sendPasswordResetConfirmationEmail = async (
  userEmail: string,
  userName: string
) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="utf-8" /></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; margin: 0;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
        <h2 style="color: #10b981; margin-top: 0;">Password Successfully Changed</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Hello ${userName || 'DevCraft User'}, the password for your DevCraft account (${userEmail}) was successfully updated on <strong>${new Date().toUTCString()}</strong>.
        </p>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
          If you performed this change, no further action is needed. If you did NOT change your password, please contact our security team immediately at support@devcraft.io.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: userEmail,
    subject: '[DevCraft] Security Alert: Your Password Was Successfully Updated',
    html,
  });
};

