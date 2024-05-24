// pages/api/profile.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).end();
    }

    const { token } = cookie.parse(req.headers.cookie || '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = await verifyToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { username, firstName, lastName, email, isGardener } = req.body;

        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        await connectToDatabase();

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.isGardener = isGardener;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
