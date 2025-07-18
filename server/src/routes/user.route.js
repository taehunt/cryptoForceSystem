import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser, // ✅ 추가
    getCurrentUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

export default router;
