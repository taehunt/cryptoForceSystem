import { findPendingDeposits, confirmDepositById } from '../services/admin.service.js';

export async function getPendingDeposits(req, res) {
    try {
        const deposits = await findPendingDeposits();
        res.json(deposits);
    } catch {
        res.status(500).json({ message: '조회 실패' });
    }
}

export async function approveDeposit(req, res) {
    const { id } = req.params;
    try {
        const updated = await confirmDepositById(Number(id));
        res.json(updated);
    } catch {
        res.status(500).json({ message: '승인 실패' });
    }
}
