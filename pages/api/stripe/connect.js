// pages/api/stripe/connect.js
import { authMiddleware } from '@/lib/middleware';
import stripe from '@/lib/stripe';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

const stripeConnectHandler = async (req, res) => {
    const userId = req.user.userId;

    try {
        await connectToDatabase();

        // Create a new Stripe account with the necessary capabilities
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'GB',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        // Create the account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_URL}/register?step=2`,
            return_url: `${process.env.NEXT_PUBLIC_URL}/register?step=3`,
            type: 'account_onboarding',
        });

        // Save the Stripe account ID to the user
        await User.findByIdAndUpdate(userId, { stripeAccountId: account.id });

        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        console.error('Failed to create Stripe account link:', error);
        res.status(500).json({ error: 'Failed to create Stripe account link' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, stripeConnectHandler);
};

export default handler;
