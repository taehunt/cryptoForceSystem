import express from 'express';
import { loginAdmin, getPendingDeposits, approveDeposit } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/deposits', getPendingDeposits);
router.post('/deposits/:id/approve', approveDeposit);

export default router;
