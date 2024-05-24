import { authMiddleware } from '@/lib/middleware';

async function handler(req, res) {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
}

export default authMiddleware(handler);
