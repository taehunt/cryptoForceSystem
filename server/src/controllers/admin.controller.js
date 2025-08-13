import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function submitPaymentTx(req, res) {
    const { id } = req.params;
    const { clientTxHash } = req.body;
    if (!clientTxHash) return res.status(400).json({ message: 'clientTxHash 필요' });

    const pr = await prisma.paymentRequest.update({
        where: { id },
        data: { clientTxHash }
    });
    res.json({ ok: true, id: pr.id });
}

// 관리자 로그인 (기존 유지)
export async function loginAdmin(req, res) {
    const { password } = req.body;
    try {
        const admin = await prisma.admin.findUnique({ where: { username: 'admin' } });
        if (!admin) return res.status(404).json({ message: '관리자 계정이 존재하지 않습니다.' });

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });

        req.session.isAdmin = true;
        return res.status(200).json({ message: '관리자 로그인 성공' });
    } catch (error) {
        console.error('관리자 로그인 오류:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 대기 결제 조회 (기존 유지)
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

// ✅ 결제요청 승인 = 입금 검증 완료 → Settlement 생성
export async function approvePayment(req, res) {
    const { id } = req.params;

    try {
        const payment = await prisma.paymentRequest.findUnique({
            where: { id },
            include: { merchant: true }
        });

        if (!payment || !payment.merchant) {
            return res.status(404).json({ message: '결제 요청 또는 상점 정보 없음' });
        }
        if (payment.status !== 'pending') {
            return res.status(400).json({ message: '이미 처리됨' });
        }

        // (선택) txHash 존재/컨펌 수 검증 로직은 워커/어댑터 연동 후 추가
        // 오늘은 관리자 승인 버튼이 "검증 완료"의 의미로 간주

        // 1) PaymentRequest 확정
        const confirmed = await prisma.paymentRequest.update({
            where: { id },
            data: { status: 'confirmed', approvedAt: new Date() } // UI도 'confirmed'에 맞춰주자
        });

        // 2) Settlement 생성 (환전/송금 전 단계)
        const grossCryptoBase =
            confirmed.amountBase ??
            BigInt(Math.round((confirmed.amount || 0) * Math.pow(10, confirmed.decimals || 6))); // 하위호환

        const settlement = await prisma.settlement.create({
            data: {
                paymentRequestId: confirmed.id,
                merchantId: confirmed.merchantId,
                grossCryptoBase,
                fxRatePpm: 0,                  // TODO: 환율 주입 시 Math.round(rate * 1e6)
                grossKRW: 0,
                feeCryptoBase: BigInt(0),
                feeKRW: 0,
                status: 'PENDING'
            }
        });

        // (선택) LedgerEntry 차/대 기록은 다음 스텝에서 추가

        return res.json({ message: '승인 완료(정산 생성)', settlementId: settlement.id, status: settlement.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '승인 처리 실패', error: err.message });
    }
}
