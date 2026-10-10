export const BREVO_API_BASE = 'https://api.brevo.com/v3';
export const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
export const BREVO_SENDER_EMAIL = process.env.SMTP_FROM_EMAIL || 'priyajitd218@gmail.com';
export const BREVO_SENDER_NAME = process.env.SMTP_FROM_NAME || 'Reliable Info Tech Platform';

export interface BrevoSender {
  name: string;
  email: string;
}

export interface BrevoCampaignPayload {
  name: string;
  subject: string;
  sender?: BrevoSender;
  type?: 'classic';
  htmlContent: string;
  recipients?: {
    listIds?: number[];
    exclusionListIds?: number[];
  };
  scheduledAt?: string;
  replyTo?: string;
}

export interface BrevoTransactionalPayload {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: BrevoSender;
  replyTo?: BrevoSender;
  params?: Record<string, any>;
}

/**
 * Checks if Brevo API Key is configured in environment
 */
export const isBrevoApiConfigured = (): boolean => {
  return Boolean(BREVO_API_KEY && !BREVO_API_KEY.includes('your_brevo'));
};

/**
 * Base helper to make authenticated calls to Brevo API v3
 */
const brevoFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  if (!isBrevoApiConfigured()) {
    throw new Error('Brevo API key is not configured in environment variables.');
  }

  const response = await fetch(`${BREVO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Brevo API error (${response.status}): ${response.statusText}`;
    const error = new Error(errorMsg);
    (error as any).code = data?.code;
    (error as any).status = response.status;
    (error as any).details = data;
    throw error;
  }

  return data as T;
};

/**
 * Inspect Brevo Account status, sender identity, and connectivity
 */
export const getBrevoAccountInfo = async () => {
  return brevoFetch('/account');
};

/**
 * Send a Transactional Email via Brevo REST API v3
 * (Endpoint: POST /smtp/email)
 */
export const sendBrevoTransactionalEmail = async (payload: BrevoTransactionalPayload) => {
  const body = {
    sender: payload.sender || {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    to: payload.to,
    subject: payload.subject,
    htmlContent: payload.htmlContent,
    textContent: payload.textContent,
    replyTo: payload.replyTo,
    params: payload.params,
  };

  return brevoFetch('/smtp/email', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Create an Email Marketing / Broadcast Campaign in Brevo
 * (Endpoint: POST /emailCampaigns)
 */
export const createBrevoEmailCampaign = async (campaign: BrevoCampaignPayload) => {
  const body = {
    name: campaign.name,
    subject: campaign.subject,
    sender: campaign.sender || {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    type: campaign.type || 'classic',
    htmlContent: campaign.htmlContent,
    recipients: campaign.recipients || { listIds: [2] },
    scheduledAt: campaign.scheduledAt,
    replyTo: campaign.replyTo,
  };

  return brevoFetch('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * List all Email Campaigns in Brevo
 * (Endpoint: GET /emailCampaigns)
 */
export const listBrevoEmailCampaigns = async (limit = 10, offset = 0) => {
  return brevoFetch(`/emailCampaigns?limit=${limit}&offset=${offset}&sort=desc`);
};
