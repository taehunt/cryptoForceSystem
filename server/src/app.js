import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { requireLogin } from './middlewares/auth.middleware.js';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';

const app = express();

// ✅ 환경변수
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'defaultSecret';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

const allowedOrigins = [
    'http://localhost:3000',
    'https://crypto-force-system.vercel.app'
];

// ✅ CORS — 맨 위에 위치, 옵션도 완전하게 설정
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ 프리플라이트 응답 추가

// ✅ 기타 미들웨어
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: COOKIE_SECURE,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60
    }
}));

// ✅ 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', (req, res, next) => {
    console.log('✅ /api/admin route hit:', req.method, req.url);
    next();
}, adminRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
