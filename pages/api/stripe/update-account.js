// pages/api/stripe/update-account.js
import { authMiddleware } from '@/lib/middleware';
import stripe from '@/lib/stripe';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

const updateStripeAccountHandler = async (req, res) => {
    await connectToDatabase();

    const userId = req.user.userId;
    const { firstName, lastName, dob, address, city, postalCode, country, businessType } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user || !user.stripeAccountId) {
            return res.status(404).json({ error: 'User not found or Stripe account not found' });
        }

        const [year, month, day] = dob.split('-');

        await stripe.accounts.update(user.stripeAccountId, {
            business_type: businessType,
            individual: {
                first_name: firstName,
                last_name: lastName,
                dob: {
                    day: parseInt(day, 10),
                    month: parseInt(month, 10),
                    year: parseInt(year, 10),
                },
                address: {
                    line1: address,
                    city: city,
                    postal_code: postalCode,
                    country: country, // Should be 'GB'
                },
            },
        });

        res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
        console.error('Failed to update account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, updateStripeAccountHandler);
};

export default handler;
