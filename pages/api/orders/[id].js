import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/middleware';

const orderHandler = async (req, res) => {
    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const order = await Order.findById(id)
                .populate('buyerId')
                .populate('gardenerIds')
                .populate('products.productId');

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.status(200).json(order);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            res.status(500).json({ error: 'Failed to fetch order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default async (req, res) => {
    await authMiddleware(req, res, orderHandler);
};
