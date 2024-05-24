import { verifyToken } from './jwt';

export async function authMiddleware(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = payload;

    next();
}
