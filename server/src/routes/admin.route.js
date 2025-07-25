import express from 'express';
import {
    loginAdmin,
    getPendingDeposits,
    approveDeposit,
    getPendingPayments,
    approvePayment,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/deposits', getPendingDeposits);
router.post('/deposits/:id/approve', approveDeposit);
router.get('/approvals', getPendingPayments);
router.post('/approvals/:id/approve', approvePayment );

export default router;
