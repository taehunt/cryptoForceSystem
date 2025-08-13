import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 소수 → 최소단위(BigInt) 변환
function toBaseByDecimals(amountDecimal, decimals) {
    const s = String(amountDecimal);
    const [i, f = ''] = s.split('.');
    const frac = (f + '0'.repeat(decimals)).slice(0, decimals);
    return BigInt(i + frac);
}

// ✅ 결제요청 생성: 입금주소/TTL 발급 (txHash는 나중에 submit)
export async function requestPayment(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // 클라에서 받는 값: 상점, 금액, (선택)체인/토큰
        const {
            merchantId,
            amount,            // 문자열 형태 권장: "10.50"
            chain = 'EVM',     // MVP: EVM 우선
            token: tokenSymbol = 'USDT'
        } = req.body;

        if (!merchantId || !amount) {
            return res.status(400).json({ message: 'merchantId, amount 필수' });
        }

        const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
        if (!merchant) return res.status(400).json({ message: '유효하지 않은 상점입니다.' });

        // ✅ 커스터디 입금주소 (MVP: ENV값 사용, 추후 요청별 가상주소로 대체)
        const depositAddress =
            chain === 'EVM'
                ? process.env.CUSTODY_EVM_ADDRESS
                : process.env.CUSTODY_TRON_ADDRESS;

        if (!depositAddress) {
            return res.status(500).json({ message: '커스터디 입금주소 미설정(CUSTODY_*_ADDRESS)' });
        }

        // ✅ USDT 기본 decimals=6
        const decimals = 6;
        const amountBase = toBaseByDecimals(amount, decimals);

        // DB 저장(하위호환을 위해 기존 필드도 채움)
        const payment = await prisma.paymentRequest.create({
            data: {
                userId,
                merchantId,
                token: tokenSymbol,
                amount: parseFloat(amount),   // (레거시) 표시용
                amountBase,                   // ✅ 정수 저장
                decimals,                     // ✅ 소수자리
                depositAddress,               // ✅ (실제 컬럼은 walletAddress로 매핑됨)
                status: 'pending'
            }
        });

        // TTL은 DB에 굳이 저장 안 하고 응답에만 포함 (원하면 스키마에 expiresAt 추가 가능)
        const ttlMs = Number(process.env.PAYMENT_TTL_MIN || 30) * 60 * 1000;
        const expiresAt = new Date(Date.now() + ttlMs).toISOString();

        res.json({
            ok: true,
            data: {
                id: payment.id,
                depositAddress,
                chain,
                token: tokenSymbol,
                decimals,
                amountDecimal: amount,
                expiresAt
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '결제 요청 실패' });
    }
}

// ✅ 사용자 결제 내역 조회
export async function getMyPaymentRequests(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const payments = await prisma.paymentRequest.findMany({
            where: { userId },
            include: { merchant: true },
            orderBy: { createdAt: 'desc' }
        });

        const result = payments.map((p) => ({
            _id: p.id,
            merchantName: p.merchant?.name || '이름 없음',
            amount: p.amount ?? Number(p.amountBase ?? 0n) / Math.pow(10, p.decimals || 6),
            status: p.status,
            txHash: p.clientTxHash || p.txHash || null,        // (하위호환)
            depositAddress: p.depositAddress || p.walletAddress,
            createdAt: p.createdAt
        }));

        res.json(result);
    } catch (err) {
        console.error('결제 내역 조회 오류:', err);
        res.status(500).json({ message: '결제 내역 조회 실패' });
    }
}

// ✅ 사용자가 송금한 txHash 제출
export async function submitPaymentTx(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    const { id } = req.params;
    const { clientTxHash } = req.body;
    if (!clientTxHash) return res.status(400).json({ message: 'clientTxHash 필요' });

    try {
        await prisma.paymentRequest.update({
            where: { id },
            data: { clientTxHash } // (실제 컬럼은 txHash로 매핑되어 있음)
        });
        res.json({ ok: true, id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'txHash 제출 실패' });
    }
}

export async function getPaymentStatus(req, res) {
    const { id } = req.params;
    try {
        const pr = await prisma.paymentRequest.findUnique({
            where: { id },
        });
        if (!pr) return res.status(404).json({ ok: false, message: 'NOT_FOUND' });

        const minConf = pr.chain === 'TRON'
            ? Number(process.env.MIN_CONF_TRON || 20)
            : Number(process.env.MIN_CONF_EVM || 12);

        return res.json({
            ok: true,
            data: {
                status: pr.status,                 // 'pending' | 'confirmed' ...
                confirmations: 0,                  // TODO: 워커 연동 시 실제값
                minConfirmations: minConf,
                chain: pr.chain || 'EVM',
                token: pr.token,
                amountDecimal:
                    pr.amount ?? (Number(pr.amountBase ?? 0n) / Math.pow(10, pr.decimals || 6)),
                settlement: null                   // (정산 생성되면 채움)
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, message: 'STATUS_FAIL' });
    }
}