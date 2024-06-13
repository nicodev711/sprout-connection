// lib/middleware.js
import { verifyToken } from './jwt';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function authMiddleware(req, res, handler) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Ensure isBlocked property is defined
    const isBlocked = user.isBlocked ?? false;

    if (isBlocked) {
        return res.status(403).json({ error: 'User is blocked' });
    }

    req.user = payload;

    return handler(req, res);
}
