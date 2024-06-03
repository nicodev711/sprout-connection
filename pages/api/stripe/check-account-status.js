import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkAccountStatusHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        // Fetch the user's Stripe account ID from your database
        const user = await User.findById(userId);
        if (!user || !user.stripeAccountId) {
            return res.status(400).json({ error: 'Stripe account not found' });
        }

        // Fetch the account details from Stripe
        const account = await stripe.accounts.retrieve(user.stripeAccountId);

        // Check if the account's capabilities are active
        const capabilities = account.capabilities;
        if (capabilities.transfers === 'active') {
            return res.status(200).json({ accountStatus: 'complete' });
        } else {
            return res.status(200).json({ accountStatus: 'incomplete', requirements: account.requirements });
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
