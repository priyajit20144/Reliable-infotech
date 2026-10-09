import { Router, Request, Response } from 'express';
import {
  verifySmtpConnection,
  sendMail,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_FROM_EMAIL,
  isSmtpConfigured,
} from '../services/emailService.js';
import {
  getBrevoAccountInfo,
  createBrevoEmailCampaign,
  listBrevoEmailCampaigns,
  isBrevoApiConfigured,
  BREVO_API_KEY,
} from '../services/brevoService.js';

const router = Router();

/**
 * GET /api/email/status
 * Returns Brevo SMTP and Brevo REST API v3 diagnostic connectivity health
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const smtpHealth = await verifySmtpConnection();
    let brevoApiHealth: any = {
      configured: isBrevoApiConfigured(),
      keyConfigured: Boolean(BREVO_API_KEY),
    };

    if (isBrevoApiConfigured()) {
      try {
        const account = await getBrevoAccountInfo();
        brevoApiHealth = {
          ...brevoApiHealth,
          connected: true,
          email: account.email,
          companyName: account.companyName,
          plan: account.plan,
        };
      } catch (apiErr: any) {
        brevoApiHealth = {
          ...brevoApiHealth,
          connected: false,
          error: apiErr?.message,
          ipNotice: apiErr?.message?.includes('unrecognised IP address')
            ? 'Add server IP (14.195.19.210) to https://app.brevo.com/security/authorised_ips'
            : undefined,
        };
      }
    }

    return res.json({
      success: true,
      data: {
        smtp: smtpHealth,
        apiV3: brevoApiHealth,
        provider: 'Brevo (Sendinblue) Transactional SMTP & REST API v3',
        fromEmail: SMTP_FROM_EMAIL,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to inspect email service health',
    });
  }
});

/**
 * GET /api/email/brevo-account
 * Direct inspection of Brevo REST API v3 Account details
 */
router.get('/brevo-account', async (_req: Request, res: Response) => {
  if (!isBrevoApiConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Brevo API key is not configured in environment variables.',
    });
  }

  try {
    const account = await getBrevoAccountInfo();
    return res.json({ success: true, data: account });
  } catch (err: any) {
    return res.status(err?.status || 500).json({
      success: false,
      error: err?.message || 'Failed to query Brevo account',
      details: err?.details,
    });
  }
});

/**
 * POST /api/email/brevo-campaign
 * Creates an email marketing / announcement campaign via Brevo API v3
 */
router.post('/brevo-campaign', async (req: Request, res: Response) => {
  const { name, subject, htmlContent, sender, recipients, scheduledAt } = req.body;

  if (!name || !subject || !htmlContent) {
    return res.status(400).json({
      success: false,
      message: 'Campaign name, subject, and htmlContent are required.',
    });
  }

  try {
    const result = await createBrevoEmailCampaign({
      name,
      subject,
      htmlContent,
      sender,
      recipients,
      scheduledAt,
    });

    return res.status(201).json({
      success: true,
      message: 'Email campaign created successfully in Brevo.',
      data: result,
    });
  } catch (err: any) {
    return res.status(err?.status || 500).json({
      success: false,
      error: err?.message || 'Failed to create Brevo email campaign',
      details: err?.details,
    });
  }
});

/**
 * GET /api/email/brevo-campaigns
 * Lists existing campaigns created in Brevo
 */
router.get('/brevo-campaigns', async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  try {
    const data = await listBrevoEmailCampaigns(limit, offset);
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(err?.status || 500).json({
      success: false,
      error: err?.message || 'Failed to list Brevo campaigns',
      details: err?.details,
    });
  }
});

/**
 * POST /api/email/test
 * Diagnostic endpoint to dispatch a test email via Brevo relay
 */
router.post('/test', async (req: Request, res: Response) => {
  const { to } = req.body;
  const targetEmail = to || SMTP_USER;

  if (!isSmtpConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Brevo SMTP is not configured in environment variables.',
    });
  }

  try {
    const result = await sendMail({
      to: targetEmail,
      subject: 'DevCraft & Brevo Integration Test',
      html: `
        <div style="font-family: sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px;">
            <h2 style="color: #6366f1; margin: 0 0 12px 0;">Brevo Integration Test Successful</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
              This email confirms that your DevCraft backend has successfully authenticated with Brevo and dispatched a live message.
            </p>
            <p style="color: #64748b; font-size: 11px; margin-top: 20px;">
              Timestamp: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        help: 'If Brevo returned an Unauthorized IP error, ensure your server IP (14.195.19.210) is added to https://app.brevo.com/security/authorised_ips.',
      });
    }

    return res.json({
      success: true,
      message: `Test email dispatched successfully to ${targetEmail}`,
      details: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to send test email',
    });
  }
});

export default router;
