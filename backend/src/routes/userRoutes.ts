import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);

export default router;
