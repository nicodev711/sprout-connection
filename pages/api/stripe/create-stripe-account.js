import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeAccountHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Create Stripe account
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'GB',
            email: user.email,
            business_type: 'individual',
            requested_capabilities: ['transfers'],
        });

        // Update user with Stripe account ID
        user.stripeAccountId = account.id;
        await user.save();

        // Create account link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.BASE_URL}/register`,
            return_url: `${process.env.BASE_URL}/dashboard`,
            type: 'account_onboarding',
        });

        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        res.status(500).json({ error: 'Failed to create Stripe account' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, createStripeAccountHandler);
};

export default handler;
