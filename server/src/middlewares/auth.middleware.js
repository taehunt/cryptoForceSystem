// src/middlewares/auth.middleware.js
export function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.status(401).send('로그인이 필요합니다.');
    }
}
