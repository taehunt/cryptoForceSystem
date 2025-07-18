// server/src/app.js
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

// ✅ .env 환경 변수 불러오기
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const SESSION_SECRET = process.env.SESSION_SECRET || 'defaultSecret';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
    'https://crypto-force-system.vercel.app', // ✅ 이 도메인 정확히 포함
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use(session({
    origin: CORS_ORIGIN,
    credentials: true,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: COOKIE_SECURE,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// ✅ 관리자 페이지 보호
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/webhook-admin', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'webhook-admin.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
