import express from 'express';
import { getPendingDeposits, approveDeposit } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/deposits', getPendingDeposits);
router.post('/deposits/:id/approve', approveDeposit);

export default router;
