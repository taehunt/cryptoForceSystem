// server/src/routes/auth.route.js
import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 로그아웃
router.post('/logout', logoutUser);

// 로그인 상태 확인
router.get('/me', getCurrentUser);

export default router;
