import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
// import Order from '@/models/Order'; // Assuming you have an Order model
// import Message from '@/models/Message'; // Assuming you have a Message model
import { authMiddleware } from '@/lib/middleware';

const handler = async (req, res) => {
    try {
        await connectToDatabase();

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId } = req.user; // Assumes authMiddleware attaches user info to req

        const productsListed = await Product.countDocuments({ userId, isListed: true });
        // const salesMade = await Order.countDocuments({ userId }); // Adjust this query as needed
        // const messages = await Message.countDocuments({ userId }); // Adjust this query as needed

        return res.status(200).json({
            productsListed,
            // salesMade,
            // messages,
        });
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

export default (req, res) => authMiddleware(req, res, () => handler(req, res));
