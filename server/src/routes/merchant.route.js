// server/src/routes/merchant.route.js
import express from 'express';
import { getAllMerchants, createTestMerchant } from '../controllers/merchant.controller.js';

const router = express.Router();

router.get('/', getAllMerchants);                // GET /api/merchants
router.post('/test', createTestMerchant);        // POST /api/merchants/test

export default router;
