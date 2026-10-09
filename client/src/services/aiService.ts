import { apiRequest } from './api';

export interface AiGatewayStatus {
  configured: boolean;
  endpoint: string;
  modelKeyMasked: string;
  activeProvider: string;
  supportedModels: string[];
}

export interface EmbeddingResult {
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

export const aiService = {
  getAiStatus: async (): Promise<{ success: boolean; data: AiGatewayStatus }> => {
    return apiRequest('/ai/status');
  },

  createEmbeddings: async (
    input: string | string[],
    model?: string
  ): Promise<{ success: boolean; data: EmbeddingResult }> => {
    return apiRequest('/ai/embeddings', {
      method: 'POST',
      body: JSON.stringify({ input, model }),
    });
  },

  rerank: async (
    query: string,
    documents: string[],
    model?: string
  ): Promise<{ success: boolean; data: any }> => {
    return apiRequest('/ai/rerank', {
      method: 'POST',
      body: JSON.stringify({ query, documents, model }),
    });
  },
};
