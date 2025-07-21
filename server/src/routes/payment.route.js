import express from 'express';
import { getPendingPayments, approvePayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/pending', getPendingPayments);
router.post('/:id/approve', approvePayment);

export default router;
