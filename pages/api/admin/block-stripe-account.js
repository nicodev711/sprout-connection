// pages/api/admin/block-user.js
import { authMiddleware } from '@/lib/middleware';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        await connectToDatabase();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default async (req, res) => {
    await authMiddleware(req, res, handler);
};
