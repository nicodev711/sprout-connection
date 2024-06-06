// pages/api/stripe/check-account-status.js
import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkAccountStatusHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user || !user.stripeAccountId) {
            console.log(`User not found or no Stripe account: UserID=${userId}`);
            return res.status(400).json({ error: 'Stripe account not found' });
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        const capabilities = account.capabilities;

        console.log(`Stripe account capabilities: ${JSON.stringify(capabilities)}`);
        console.log(`Stripe account requirements: ${JSON.stringify(account.requirements)}`);

        if (capabilities.transfers === 'active' && account.requirements.disabled_reason === null) {
            return res.status(200).json({ accountStatus: 'complete' });
        } else {
            return res.status(200).json({
                accountStatus: 'incomplete',
                requirements: account.requirements.currently_due,
                disabledReason: account.requirements.disabled_reason
            });
        }
    } catch (error) {
        console.error('Error checking Stripe account status:', error);
        res.status(500).json({ error: 'Failed to check Stripe account status' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, checkAccountStatusHandler);
};

export default handler;
