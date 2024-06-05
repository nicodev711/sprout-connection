// pages/api/stripe/create-stripe-account.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';
import stripe from '@/lib/stripe';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { token } = cookie.parse(req.headers.cookie || '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = await verifyToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { userId, country, email, firstName, lastName, dob, address, city, postalCode, state, phone } = req.body;

        await connectToDatabase();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure the phone number is in E.164 format
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

        const account = await stripe.accounts.create({
            type: 'custom',
            country,
            email,
            business_type: 'individual',
            business_profile: {
                mcc: '0763', // Merchant category code for "Selling home grown produce"
                product_description: 'Selling home grown produce',
                name: `${firstName} ${lastName}`,
            },
            individual: {
                first_name: firstName,
                last_name: lastName,
                dob: {
                    day: dob.split('-')[2],
                    month: dob.split('-')[1],
                    year: dob.split('-')[0],
                },
                address: {
                    line1: address,
                    city,
                    postal_code: postalCode,
                    state,
                    country,
                },
                phone: formattedPhone,
            },
            capabilities: {
                transfers: { requested: true },
                card_payments: { requested: true },
            },
        });

        user.stripeAccountId = account.id;
        await user.save();

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.BASE_URL}/register/stripe-setup?userId=${user._id}`,
            return_url: `${process.env.BASE_URL}/dashboard`,
            type: 'account_onboarding',
        });

        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
