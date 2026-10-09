import { Router, Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.status(201).json({
    success: true,
    message: 'File uploaded successfully.',
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
