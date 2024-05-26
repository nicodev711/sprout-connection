import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { authMiddleware } from '@/lib/middleware';
const userHandler = async (req, res) => {
    await connectToDatabase();

    if (req.method === 'GET') {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const products = await Product.find({ userId });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

const handler = async (req, res) => {
    await authMiddleware(req, res, userHandler);
};

export default handler;
