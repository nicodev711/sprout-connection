// pages/api/statistics.js
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import User from '@/models/User';
import { authMiddleware } from '@/lib/middleware';

const statsHandler = async (req, res) => {
    try {
        await connectToDatabase();

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId } = req.user; // Assumes authMiddleware attaches user info to req

        const productsListed = await Product.countDocuments({ userId, isListed: true });
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            productsListed,
            withdrawableAmount: user.withdrawableAmount,
        });
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, statsHandler);
};

export default handler;
