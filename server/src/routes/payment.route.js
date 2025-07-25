import express from 'express';
import { requestPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/request', requestPayment); // POST /api/payments/request

export default router;
