import express from 'express';
import { requestPayment, getMyPaymentRequests, submitPaymentTx, getPaymentStatus } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/request', requestPayment);
router.post('/:id/submit-tx', submitPaymentTx);
router.get('/:id/status', getPaymentStatus);   // ✅ 추가
router.get('/my-requests', getMyPaymentRequests);

export default router;
