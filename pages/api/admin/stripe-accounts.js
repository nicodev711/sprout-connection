// pages/api/admin/stripe-accounts.js
import { authMiddleware } from '@/lib/middleware';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import stripe from '@/lib/stripe';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();

        const users = await User.find();
        const stripeAccounts = await stripe.accounts.list({ limit: 100 });

        const allUsers = users.map(user => {
            const stripeAccount = stripeAccounts.data.find(account => account.id === user.stripeAccountId);
            return {
                userId: user._id,
                username: user.username,
                email: user.email,
                isBlocked: user.isBlocked ?? false,
                inDatabase: true,
                inStripe: !!stripeAccount
            };
        });

        stripeAccounts.data.forEach(account => {
            if (!allUsers.find(user => user.userId === account.id)) {
                allUsers.push({
                    userId: account.id,
                    username: account.business_profile.name || 'Stripe User',
                    email: account.email,
                    isBlocked: false,
                    inDatabase: false,
                    inStripe: true
                });
            }
        });

        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.error('Error fetching users and Stripe accounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default async (req, res) => {
    await authMiddleware(req, res, handler);
};
