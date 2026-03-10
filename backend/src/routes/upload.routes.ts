import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Only admins can upload banners
router.post('/banner', authMiddleware, adminMiddleware, UploadController.uploadBanner);

export default router;
