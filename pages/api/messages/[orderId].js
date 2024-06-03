import connectToDatabase from '@/lib/mongoose';
import Message from '@/models/Message';
import { authMiddleware } from '@/lib/middleware';

const handler = async (req, res) => {
    await connectToDatabase();

    const { orderId } = req.query;

    if (req.method === 'GET') {
        try {
            const messages = await Message.find({ orderId }).sort({ timestamp: 1 });
            return res.status(200).json(messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

export default async (req, res) => {
    await authMiddleware(req, res, handler);
};
