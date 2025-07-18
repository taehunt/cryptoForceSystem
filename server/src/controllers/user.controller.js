import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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

// 로그인 (id + password)
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

// 현재 로그인된 사용자 확인
export async function getCurrentUser(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: '로그인 필요' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        res.json({ id: user.id, email: user.email });
    } catch {
        res.status(401).json({ message: '토큰이 유효하지 않음' });
    }
}

export async function logoutUser(req, res) {
    res.clearCookie('token');
    res.json({ message: '로그아웃 완료' });
}

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
