import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
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

        await connectToDatabase();

        const order = await Order.findById(id).populate('products.productId');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure the user making the request is the buyer or one of the gardeners involved in the order
        if (order.buyerId.toString() !== payload.userId && !order.gardenerIds.includes(payload.userId)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
