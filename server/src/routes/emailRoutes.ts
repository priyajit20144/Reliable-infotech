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

const router = Router();

/**
 * GET /api/email/status
 * Returns Brevo SMTP connectivity and diagnostic health info
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const health = await verifySmtpConnection();
    return res.json({
      success: true,
      data: {
        ...health,
        provider: 'Brevo (Sendinblue) Transactional SMTP',
        fromEmail: SMTP_FROM_EMAIL,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to inspect SMTP health',
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
      subject: 'DevCraft & Brevo SMTP Integration Test',
      html: `
        <div style="font-family: sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px;">
            <h2 style="color: #6366f1; margin: 0 0 12px 0;">Brevo SMTP Relay Test Successful</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
              This email confirms that your DevCraft backend has successfully authenticated with Brevo (smtp-relay.brevo.com:587) and dispatched a live message.
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
        help: 'If Brevo returned an Unauthorized IP error, ensure your server IP is whitelisted in Brevo SMTP settings.',
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
