import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password, isGardener, acceptedTerms, acceptedPrivacyPolicy } = req.body;

    if (!username || !email || !password || !acceptedTerms || !acceptedPrivacyPolicy) {
        return res.status(400).json({ error: 'Username, email, password, postcode, and acceptance of terms and privacy policy are required' });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isGardener,
            acceptedTerms,
            acceptedPrivacyPolicy  // Include this in the user creation
        });

        const token = await signToken({ userId: user._id });

        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: true, // Secure should be true in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        }));
        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
