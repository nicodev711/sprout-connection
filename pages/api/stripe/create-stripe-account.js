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

        if (user.stripeAccountId) {
            // Check if the account needs to be completed
            const account = await stripe.accounts.retrieve(user.stripeAccountId);
            const requirements = account.requirements.currently_due || [];
            if (requirements.length > 0) {
                // Create account link for completion
                const accountLink = await stripe.accountLinks.create({
                    account: user.stripeAccountId,
                    refresh_url: `https://${process.env.BASE_URL}/dashboard`,
                    return_url: `https://${process.env.BASE_URL}/dashboard`,
                    type: 'account_onboarding',
                });
                return res.status(200).json({ url: accountLink.url });
            } else {
                return res.status(200).json({ message: 'Account already complete' });
            }
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

        // Create account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `https://${process.env.BASE_URL}/dashboard`,
            return_url: `https://${process.env.BASE_URL}/dashboard`,
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
