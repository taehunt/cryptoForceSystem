import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 쿠키(JWT) → Authorization(Bearer) → 세션(userId) 순으로 인증
export function authMiddleware(req, res, next) {
    // 1) JWT 쿠키
    const cookieToken = req.cookies?.token;

    // 2) Bearer
    const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/, '');

    // 3) 세션 (로그인 시 세팅되어 있다면)
    const sessionUserId = req.session?.userId || req.session?.user?.id;

    if (cookieToken || bearer) {
        try {
            const token = cookieToken || bearer;
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = { id: decoded.id };
            return next();
        } catch (e) {
            // JWT가 있긴 한데 검증 실패 → 세션으로 폴백 시도
        }
    }

    if (sessionUserId) {
        req.user = { id: sessionUserId };
        return next();
    }

    return res.status(401).json({ message: 'Unauthorized' });
}

// 기존 코드 호환
export const requireLogin = authMiddleware;
export default authMiddleware;
