import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getMe, updateWallet } from '../controllers/user.controller.js';

const router = express.Router();

// 최종 경로: GET /api/user/me
router.get('/me', authMiddleware, getMe);

// 최종 경로: PATCH /api/user/wallet
router.patch('/wallet', authMiddleware, updateWallet);

export default router;
