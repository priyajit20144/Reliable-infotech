import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

export interface EmbeddingResponse {
  object: string;
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    total_tokens: number;
  };
}

export interface RerankResponse {
  object: string;
  data: Array<{
    relevance_score: number;
    index: number;
    document?: string;
  }>;
  model: string;
  usage: {
    total_tokens: number;
  };
}

export interface AiGatewayStatus {
  configured: boolean;
  endpoint: string;
  modelKeyMasked: string;
  activeProvider: string;
  supportedModels: string[];
}

class AiService {
  private getApiKey(): string {
    const rawKey =
      process.env.MONGODB_MODEL_API_KEY ||
      process.env.VOYAGE_API_KEY ||
      '';
    let trimmed = rawKey.trim().replace(/^["']|["']$/g, '');
    // Gracefully handle common OCR/typo where 'al-' was typed instead of 'ai-'
    if (trimmed.startsWith('al-')) {
      trimmed = 'ai-' + trimmed.slice(3);
    }
    return trimmed;
  }

  private getEndpoint(): string {
    const rawEndpoint =
      process.env.MONGODB_AI_ENDPOINT || 'https://ai.mongodb.com/v1';
    return rawEndpoint.trim().replace(/\/+$/, '');
  }

  public getStatus(): AiGatewayStatus {
    const key = this.getApiKey();
    const endpoint = this.getEndpoint();
    const masked = key
      ? `${key.slice(0, 6)}...${key.slice(-4)}`
      : 'Not Configured';

    return {
      configured: Boolean(key),
      endpoint,
      modelKeyMasked: masked,
      activeProvider: 'MongoDB Atlas AI Model APIs (Voyage AI)',
      supportedModels: [
        'voyage-3-lite',
        'voyage-3',
        'voyage-code-3',
        'voyage-large-2',
        'rerank-2',
      ],
    };
  }

  /**
   * Generates dense vector embeddings using MongoDB Atlas Model API Gateway
   */
  public async generateEmbeddings(
    texts: string | string[],
    model: string = 'voyage-3-lite'
  ): Promise<EmbeddingResponse> {
    const key = this.getApiKey();
    if (!key) {
      throw new Error(
        'MongoDB Model API Key is not configured. Please define MONGODB_MODEL_API_KEY in .env.'
      );
    }

    const endpoint = `${this.getEndpoint()}/embeddings`;
    const input = Array.isArray(texts) ? texts : [texts];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        input,
        model,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let parsedErr: any;
      try {
        parsedErr = JSON.parse(errBody);
      } catch {
        parsedErr = { message: errBody };
      }
      throw new Error(
        `MongoDB AI Model API Error (${response.status}): ${
          parsedErr.detail || parsedErr.message || response.statusText
        }`
      );
    }

    return (await response.json()) as EmbeddingResponse;
  }

  /**
   * Reranks candidate documents by semantic relevance to a query
   */
  public async rerank(
    query: string,
    documents: string[],
    model: string = 'rerank-2'
  ): Promise<RerankResponse> {
    const key = this.getApiKey();
    if (!key) {
      throw new Error(
        'MongoDB Model API Key is not configured. Please define MONGODB_MODEL_API_KEY in .env.'
      );
    }

    const endpoint = `${this.getEndpoint()}/rerank`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        query,
        documents,
        model,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let parsedErr: any;
      try {
        parsedErr = JSON.parse(errBody);
      } catch {
        parsedErr = { message: errBody };
      }
      throw new Error(
        `MongoDB AI Model Rerank Error (${response.status}): ${
          parsedErr.detail || parsedErr.message || response.statusText
        }`
      );
    }

    return (await response.json()) as RerankResponse;
  }
}

export const aiService = new AiService();
