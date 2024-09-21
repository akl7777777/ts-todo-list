import express from 'express';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 这些路由不需要鉴权
router.post('/login', login);
router.post('/register', register);

// 如果有需要鉴权的路由，可以在这里添加中间件
// router.get('/profile', authMiddleware, getProfile);

export default router;
