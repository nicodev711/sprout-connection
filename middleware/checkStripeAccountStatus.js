// middleware/stripeStatusCheck.js
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeStatusCheck = async (req, res, next) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user || !user.stripeAccountId) {
            return res.status(400).json({ error: 'Stripe account not found' });
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        const capabilities = account.capabilities;
        const requirements = account.requirements;

        if (capabilities.transfers === 'active') {
            req.stripeStatus = 'complete';
        } else {
            req.stripeStatus = 'restricted';
            req.stripeRequirements = requirements;
        }
        next();
    } catch (error) {
        console.error('Error checking Stripe account status:', error);
        res.status(500).json({ error: 'Failed to check Stripe account status' });
    }
};
