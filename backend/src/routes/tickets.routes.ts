import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/my-tickets', authMiddleware, TicketController.listByUser);
router.post('/validate', authMiddleware, TicketController.validate); // Requer admin numa app real

export default router;
