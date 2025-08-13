import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { PrismaClient } from '@prisma/client';
import {
    loginAdmin,
    getPendingPayments,   // 예전 getPendingDeposits 대신
    approvePayment,       // 예전 approveDeposit 대신
} from '../controllers/admin.controller.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/login', loginAdmin);

// 예전 /deposits → /payments 로 변경
router.get('/payments', getPendingPayments);
router.post('/payments/:id/approve', approvePayment);

// ✅ 호환용 프로필 조회
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const me = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, wallet: true, defaultWalletType: true }
        });
        if (!me) return res.status(404).json({ message: 'Not found' });
        res.json(me);
    } catch {
        res.status(500).json({ message: 'me failed' });
    }
});

export default router;
