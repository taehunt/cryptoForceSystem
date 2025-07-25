import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function requestPayment(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const { merchantId, amount, walletAddress } = req.body;
        if (!merchantId || !amount || !walletAddress)
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });

        const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
        if (!merchant || !merchant.isActive)
            return res.status(400).json({ message: '유효하지 않은 상점입니다.' });

        const token = Math.random().toString(36).substring(2, 10).toUpperCase();

        const payment = await prisma.paymentRequest.create({
            data: {
                userId,
                merchantId,
                amount: parseFloat(amount),
                walletAddress,
                token,
            },
        });

        res.json({ message: '결제 요청이 생성되었습니다.', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '결제 요청 실패' });
    }
}
