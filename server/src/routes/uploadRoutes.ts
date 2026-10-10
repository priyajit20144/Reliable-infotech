import { Router, Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.status(201).json({
    success: true,
    message: isServerless
      ? 'File uploaded to temporary instance storage. Use Supabase storage for cloud persistence.'
      : 'File uploaded successfully.',
    isEphemeral: isServerless,
    file: {
      name: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
    },
  });
});

export default router;
