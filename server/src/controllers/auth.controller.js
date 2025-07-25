import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// 회원가입
export async function registerUser(req, res) {
    const { id, email, password } = req.body;
    try {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (existing) return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });

        const hash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { id, email, passwordHash: hash },
        });

        res.json({ id: newUser.id, email: newUser.email });
    } catch {
        res.status(500).json({ message: '회원가입 실패' });
    }
}

// 로그인
export async function loginUser(req, res) {
    const { id, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(400).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다.' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(400).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다.' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.json({ id: user.id, email: user.email });
    } catch {
        res.status(500).json({ message: '로그인 실패' });
    }
}

// 로그아웃
export async function logoutUser(req, res) {
    res.clearCookie('token');
    res.json({ message: '로그아웃 완료' });
}

// 현재 로그인된 사용자 조회
export async function getCurrentUser(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        res.json({ id: user.id, email: user.email });
    } catch {
        res.status(401).json({ message: '토큰이 유효하지 않음' });
    }
}

// 비밀번호 재설정 요청 (토큰 발급)
export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: '이메일을 찾을 수 없습니다.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = dayjs().add(1, 'hour').toDate();

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry: expiry },
        });

        const resetLink = `${CLIENT_URL}/reset-password/${token}`;
        console.log('✅ 비밀번호 재설정 링크:', resetLink); // 추후 이메일 발송으로 대체

        res.json({ message: '비밀번호 재설정 링크가 생성되었습니다.' });
    } catch {
        res.status(500).json({ message: '요청 실패' });
    }
}

// 비밀번호 재설정 수행
export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) return res.status(400).json({ message: '유효하지 않거나 만료된 토큰입니다.' });

        const hash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.json({ message: '비밀번호가 재설정되었습니다.' });
    } catch {
        res.status(500).json({ message: '재설정 실패' });
    }
}

// 로그인 상태에서 비밀번호 변경
export async function changePassword(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ message: '사용자 없음' });

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: '현재 비밀번호가 틀렸습니다.' });

        const newHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
        });

        res.json({ message: '비밀번호 변경 완료' });
    } catch {
        res.status(500).json({ message: '변경 실패' });
    }
}

// 지갑주소 변경
export async function updateWalletAddress(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { walletAddress } = req.body;

        await prisma.user.update({
            where: { id: decoded.id },
            data: { walletAddress },
        });

        res.json({ message: '지갑 주소가 업데이트되었습니다.' });
    } catch {
        res.status(500).json({ message: '지갑 주소 업데이트 실패' });
    }
}
