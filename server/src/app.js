import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { requireLogin } from './middlewares/auth.middleware.js';

import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import merchantRoutes from './routes/merchant.route.js';
import paymentRoutes from './routes/payment.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

// ✅ NODE_ENV에 따라 알맞은 .env 파일 로드
const nodeEnv = process.env.NODE_ENV || 'development';
const envPath = `.env.${nodeEnv}`;
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config(); // fallback to default .env
}

// ✅ 환경변수
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'defaultSecret';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

const allowedOrigins = [
    'http://localhost:3000',
    'https://crypto-force-system.vercel.app'
];

// ✅ CORS
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
app.use('/api/admin', (req, res, next) => {
    console.log('✅ /api/admin route hit:', req.method, req.url);
    next();
}, adminRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
