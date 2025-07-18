// server/src/controllers/auth.controller.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

// 회원가입
export const registerUser = async (req, res) => {
    try {
        const { id, email, password, confirmPassword } = req.body;

        if (!id || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { id: id }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('[user.create 값]', { id, email, passwordHash: hashedPassword });

        const newUser = await prisma.user.create({
            data: {
                id: String(id),
                email,
                passwordHash: hashedPassword,  // ✅ 이 줄도 수정
            },
        });

        return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 로그인
export const loginUser = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({ message: 'ID와 비밀번호를 입력해주세요.' });
        }

        const user = await prisma.user.findFirst({
            where: { id: { equals: id } }, // 명시적으로 string
        });

        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 현재 유저 정보
export const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: '토큰이 필요합니다.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        return res.status(200).json({
            id: user.id,
            email: user.email,
        });
    } catch (error) {
        console.error('유저 조회 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 로그아웃 (프론트에서 토큰 삭제로 처리됨)
export const logoutUser = async (req, res) => {
    return res.status(200).json({ message: '로그아웃 되었습니다.' });
};
