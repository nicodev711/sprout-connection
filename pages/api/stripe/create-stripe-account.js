// pages/api/create-stripe-account.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeAccountHandler = async (req, res) => {
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

        if (user.stripeAccountId) {
            return res.status(400).json({ error: 'Stripe account already exists' });
        }

        const account = await stripe.accounts.create({
            type: 'express',
            email: user.email,
            capabilities: {
                transfers: { requested: true },
            },
        });

        user.stripeAccountId = account.id;
        await user.save();

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${req.headers.origin}/reauth`,
            return_url: `${req.headers.origin}/dashboard`,
            type: 'account_onboarding',
        });

        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        console.error('Failed to create Stripe account:', error);
        res.status(500).json({ error: 'Failed to create Stripe account' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, createStripeAccountHandler);
};

export default handler;
