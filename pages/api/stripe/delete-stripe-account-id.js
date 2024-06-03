// pages/api/delete-stripe-account-id.js
import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const deleteStripeAccountIdHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        await User.findByIdAndUpdate(userId, { stripeAccountId: null });
        res.status(200).json({ message: 'Stripe account ID deleted successfully' });
    } catch (error) {
        console.error('Failed to delete Stripe account ID:', error);
        res.status(500).json({ error: 'Failed to delete Stripe account ID' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, deleteStripeAccountIdHandler);
};

export default handler;
