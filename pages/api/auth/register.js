// pages/api/auth/register.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';
import stripe from '@/lib/stripe';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password, isGardener, firstName, lastName, dob, address, city, postalCode, state, country, phone } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Fetch latitude and longitude from postcodes.io
        let latitude = null;
        let longitude = null;
        if (postalCode) {
            const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postalCode)}`);
            const data = await response.json();
            if (data.status === 200) {
                latitude = data.result.latitude;
                longitude = data.result.longitude;
            } else {
                return res.status(400).json({ error: 'Invalid postcode' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isGardener,
            postcode: postalCode,
            latitude, // Add latitude to user document
            longitude, // Add longitude to user document
            acceptedTerms: true,
            acceptedPrivacyPolicy: true,
            termsAcceptedDate: new Date()
        });

        const token = await signToken({ userId: user._id });

        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: true, // Should be true in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        }));

        if (isGardener) {
            const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

            const account = await stripe.accounts.create({
                type: 'custom',
                country,
                email,
                business_type: 'individual',
                business_profile: {
                    mcc: '0763', // Merchant Category Code for agricultural products
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
                },
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                },
            });

            user.stripeAccountId = account.id;
            await user.save();

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/register/stripe-setup?userId=${user._id}`,
                return_url: `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/dashboard?registered=true`,
                type: 'account_onboarding',
            });

            return res.status(200).json({ url: accountLink.url });
        } else {
            return res.status(201).json({ message: 'User created', userId: user._id });
        }
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
