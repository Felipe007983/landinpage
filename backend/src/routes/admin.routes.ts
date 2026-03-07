import { Router } from 'express';
import { adminMiddleware } from '../middleware/admin.middleware';
import { authMiddleware } from '../middleware/auth';
import { AdminController } from '../controllers/AdminController';
import { ChampionshipController } from '../controllers/ChampionshipController';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.patch('/championships/:id/status', AdminController.toggleChampionshipStatus);
router.put('/championships/:id', AdminController.updateChampionship);
router.delete('/championships/:id', AdminController.deleteChampionship);
router.get('/orders', AdminController.listAllOrders);
router.get('/users', AdminController.listUsers);
router.post('/championships', ChampionshipController.create);

export default router;
