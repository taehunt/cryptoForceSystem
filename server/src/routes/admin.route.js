import express from 'express';
import { loginAdmin, getPendingDeposits, approveDeposit } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/deposits', getPendingDeposits);
router.post('/deposits/:id/approve', approveDeposit);
router.post('/login', loginAdmin);

export default router;
