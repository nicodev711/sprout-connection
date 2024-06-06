import Stripe from 'stripe';
import { authMiddleware } from '@/lib/middleware';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const completeProfileHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user || !user.stripeAccountId) {
            return res.status(400).json({ error: 'Stripe account not found' });
        }

        // Update account information
        const updatedAccount = await stripe.accounts.update(user.stripeAccountId, {
            // Add the missing data here, such as additional account details
            // For example:
            // business_type: 'individual',
            // business_profile: {
            //     mcc: '1234',
            //     url: 'https://example.com',
            // },
        });

        res.status(200).json({ updatedAccount });
    } catch (error) {
        console.error('Error completing Stripe profile:', error);
        res.status(500).json({ error: 'Failed to complete Stripe profile' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, completeProfileHandler);
};

export default handler;
