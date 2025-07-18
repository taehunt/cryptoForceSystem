import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { findPendingDeposits, confirmDepositById } from '../services/admin.service.js';

const prisma = new PrismaClient();

// 관리자 로그인
export async function loginAdmin(req, res) {
    const { password } = req.body;

    try {
        const admin = await prisma.admin.findUnique({ where: { username: 'admin' } });

        if (!admin) {
            return res.status(404).json({ message: '관리자 계정이 존재하지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
        }

        req.session.isAdmin = true;

        return res.status(200).json({ message: '관리자 로그인 성공' });
    } catch (error) {
        console.error('관리자 로그인 오류:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 입금 요청 목록 조회
export async function getPendingDeposits(req, res) {
    try {
        const deposits = await findPendingDeposits();
        res.json(deposits);
    } catch {
        res.status(500).json({ message: '조회 실패' });
    }
}

// 입금 요청 승인
export async function approveDeposit(req, res) {
    const { id } = req.params;
    try {
        const updated = await confirmDepositById(Number(id));
        res.json(updated);
    } catch {
        res.status(500).json({ message: '승인 실패' });
    }
}
