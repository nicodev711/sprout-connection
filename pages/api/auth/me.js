// pages/api/auth/me.js
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import cookie from 'cookie';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { token } = cookie.parse(req.headers.cookie || '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = await verifyToken(token);
        await connectToDatabase();
        const user = await User.findById(payload.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
