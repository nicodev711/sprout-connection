// pages/api/orders/gardener-recent.js
import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

const gardenerRecentOrdersHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const recentOrders = await Order.find({ gardenerIds: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('products.productId', 'title units');

        res.status(200).json(recentOrders);
    } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        res.status(500).json({ error: 'Failed to fetch recent orders' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, gardenerRecentOrdersHandler);
};

export default handler;
