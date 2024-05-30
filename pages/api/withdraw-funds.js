// pages/api/withdraw-funds.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const withdrawFundsHandler = async (req, res) => {
    await connectToDatabase();
    const userId = req.user.userId;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.stripeAccountId) {
            return res.status(400).json({ error: 'Stripe account not found' });
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);

        if (!account.capabilities.transfers || account.capabilities.transfers !== 'active') {
            return res.status(400).json({ error: 'Stripe account does not have transfer capability enabled' });
        }

        const amount = Math.round(user.withdrawableAmount * 100); // Amount in cents

        if (amount <= 0) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const transfer = await stripe.transfers.create({
            amount,
            currency: 'gbp',
            destination: user.stripeAccountId,
        });

        user.withdrawableAmount = 0;
        user.totalEarnings += amount / 100;
        await user.save();

        res.status(200).json({ message: 'Funds withdrawn successfully', transfer });
    } catch (error) {
        console.error('Failed to withdraw funds:', error);
        res.status(500).json({ error: 'Failed to withdraw funds' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, withdrawFundsHandler);
};

export default handler;
