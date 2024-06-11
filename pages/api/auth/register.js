// pages/api/auth/register.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';
import stripe from '@/lib/stripe';
import axios from "axios";

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Destructure the request body to get user details
    const { username, email, password, isGardener, firstName, lastName, dob, address, city, postalCode, state, country, phone } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // Connect to the database
        await connectToDatabase();

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Fetch latitude and longitude from postcodes.io if postalCode is provided
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

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
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

        // Sign a JWT token for the user
        const token = await signToken({ userId: user._id });

        // Set a cookie with the JWT token
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: true, // Should be true in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        }));

        // Brevo API call to add user to list
        const brevoAddUserToList = async (email, firstName, listIds) => {
            try {
                await axios.post('https://api.sendinblue.com/v3/contacts', {
                    email: email,
                    attributes: {
                        FIRSTNAME: firstName,
                    },
                    listIds: listIds
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.SENDINBLUE_API_KEY
                    }
                });
            } catch (error) {
                console.error('Error adding user to Brevo list:', error.response ? error.response.data : error.message);
            }
        };

        if (isGardener) {
            // If the user is a gardener, format the phone number and create a Stripe account
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

            // Save the Stripe account ID in the user's document
            user.stripeAccountId = account.id;
            await user.save();

            // Create a Stripe account link for onboarding
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/register/stripe-setup?userId=${user._id}`,
                return_url: `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/dashboard?registered=true`,
                type: 'account_onboarding',
            });

            // Add user to the gardener list in Brevo
            await brevoAddUserToList(email, firstName, [10, 12]);

            // Respond with the account onboarding URL
            return res.status(200).json({ url: accountLink.url });
        } else {
            // Add user to the non-gardener list in Brevo
            await brevoAddUserToList(email, firstName, [10, 11]);
            // If the user is not a gardener, simply respond with a success message
            return res.status(201).json({ message: 'User created', userId: user._id });
        }
    } catch (error) {
        console.error('Error creating user or Stripe account:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
