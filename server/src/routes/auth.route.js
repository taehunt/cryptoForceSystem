import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword,
    updateWalletAddress
} from '../controllers/auth.controller.js'; // ✅ 모든 auth 관련 컨트롤러에서 관리

const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 로그아웃
router.post('/logout', logoutUser);

// 로그인 상태 확인
router.get('/me', getCurrentUser);

// 비밀번호 재설정 요청
router.post('/forgot-password', forgotPassword);

// 비밀번호 재설정 수행
router.post('/reset-password', resetPassword);

// 비밀번호 변경
router.post('/change-password', changePassword);

// 지갑 주소 변경
router.post('/update-wallet', updateWalletAddress);

export default router;
