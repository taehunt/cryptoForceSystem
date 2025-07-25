import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { findPendingDeposits, confirmDepositById } from '../services/admin.service.js';
import { sendToken } from '../utils/web3.js';

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

export async function getPendingPayments(req, res) {
    try {
        const payments = await prisma.paymentRequest.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch {
        res.status(500).json({ message: '조회 실패' });
    }
}

// 결제 요청 승인
export async function approvePayment(req, res) {
    const { id } = req.params;

    try {
        const payment = await prisma.paymentRequest.findUnique({
            where: { id },
            include: { merchant: true }, // ✅ 상점 정보 함께 가져오기
        });

        if (!payment || !payment.merchant) return res.status(404).json({ message: '결제 요청 또는 상점 정보 없음' });
        if (payment.status !== 'pending') return res.status(400).json({ message: '이미 처리됨' });

        const { walletPrivateKey, tokenAddress, walletAddress } = payment.merchant;
        const amountInUnits = BigInt(payment.amount) * 10n ** 6n;

        const txHash = await sendToken({
            privateKey: walletPrivateKey,
            tokenAddress,
            to: payment.walletAddress,
            amount: amountInUnits.toString()
        });

        const updated = await prisma.paymentRequest.update({
            where: { id },
            data: {
                status: 'approved',
                txHash,
                approvedAt: new Date()
            }
        });

        res.json({ message: '승인 및 전송 완료', payment: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Web3 전송 실패', error: err.message });
    }
}