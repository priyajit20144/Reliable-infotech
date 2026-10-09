import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';

export const getAiStatus = async (_req: Request, res: Response) => {
  try {
    const status = aiService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to retrieve AI Model API status',
    });
  }
};

export const createEmbeddings = async (req: Request, res: Response) => {
  try {
    const { input, model } = req.body;
    if (!input) {
      return res.status(400).json({
        success: false,
        message: 'Input text or array of strings is required',
      });
    }

    const result = await aiService.generateEmbeddings(input, model);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate vector embeddings',
    });
  }
};

export const rerankDocuments = async (req: Request, res: Response) => {
  try {
    const { query, documents, model } = req.body;
    if (!query || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query string and non-empty documents array are required',
      });
    }

    const result = await aiService.rerank(query, documents, model);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to rerank documents',
    });
  }
};
