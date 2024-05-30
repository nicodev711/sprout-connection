// pages/api/basket.js
import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import Basket from '@/models/Basket';

const basketHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    if (req.method === 'POST') {
        const { basket } = req.body;

        try {
            const updatedBasket = await Basket.findOneAndUpdate(
                { userId },
                { items: basket },
                { new: true, upsert: true }
            ).populate('items.productId', 'title price');  // Ensure product details are populated
            return res.status(200).json(updatedBasket);
        } catch (error) {
            console.error('Failed to save basket:', error);
            return res.status(500).json({ error: 'Failed to save basket' });
        }
    } else if (req.method === 'GET') {
        try {
            const userBasket = await Basket.findOne({ userId }).populate('items.productId', 'title price');

            if (!userBasket) {
                return res.status(200).json({ items: [] });
            }

            return res.status(200).json(userBasket);
        } catch (error) {
            console.error('Failed to load basket:', error);
            return res.status(500).json({ error: 'Failed to load basket' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

const withAuth = (handler) => async (req, res) => {
    await authMiddleware(req, res, async () => {
        await handler(req, res);
    });
};

export default withAuth(basketHandler);
