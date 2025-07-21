// server/src/controllers/merchant.controller.js
import { prisma } from '../lib/prismaClient.js';

export const getAllMerchants = async (req, res) => {
    try {
        const merchants = await prisma.merchant.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                walletAddress: true,
            },
        });
        res.json(merchants);
    } catch (err) {
        console.error('상점 목록 조회 오류:', err);
        res.status(500).json({ error: '상점 조회 실패' });
    }
};

export const createTestMerchant = async (req, res) => {
    try {
        const merchant = await prisma.merchant.create({
            data: {
                name: '스타벅스 강남점',
                description: '테스트용 가맹점입니다.',
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                // paymentRequests 필드 없음 → 관계 없음
            },
        });
        res.json({ message: '등록 성공', merchant });
    } catch (err) {
        console.error('가맹점 등록 오류:', err);
        res.status(500).json({ error: '등록 실패', detail: err.message });
    }
};