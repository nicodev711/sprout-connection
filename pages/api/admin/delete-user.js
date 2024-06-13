// pages/api/admin/delete-user.js
import { authMiddleware } from '@/lib/middleware';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import Product from '@/models/Product';
import stripe from '@/lib/stripe';
import mongoose from 'mongoose';

async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        await connectToDatabase();

        let user;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        } else {
            // Try to find user by Stripe account ID
            user = await User.findOne({ stripeAccountId: userId });
        }

        // Delete the user's products if the user exists in the database
        if (user) {
            await Product.deleteMany({ userId: user._id });
            await User.findByIdAndDelete(user._id);
        }

        // Also attempt to delete the Stripe account if it exists
        try {
            await stripe.accounts.del(userId);
        } catch (stripeError) {
            console.error('Error deleting Stripe account:', stripeError);
            // Continue even if Stripe account deletion fails
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default async (req, res) => {
    await authMiddleware(req, res, handler);
};
