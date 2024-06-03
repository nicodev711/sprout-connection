import connectToDatabase from '@/lib/mongoose';
import Message from '@/models/Message';
import { authMiddleware } from '@/lib/middleware';

const handler = async (req, res) => {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { orderId, receiverId, content } = req.body;

        if (!orderId || !receiverId || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const newMessage = new Message({
                orderId,
                senderId: req.user.userId,
                receiverId,
                content,
            });
            await newMessage.save();
            return res.status(201).json(newMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
            return res.status(500).json({ error: 'Failed to send message' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

export default async (req, res) => {
    await authMiddleware(req, res, handler);
};
