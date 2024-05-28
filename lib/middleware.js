// lib/middleware.js
import { verifyToken } from './jwt';

export async function authMiddleware(req, res, handler) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = payload;

    return handler(req, res); // Call the handler directly
}
