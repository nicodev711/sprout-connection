import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req, res) {
    console.log('Request method:', req.method); // Debugging log

    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password, isGardener } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        console.log('Connecting to database...');
        await connectToDatabase();
        console.log('Connected to database.');

        console.log('Checking for existing user...');
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('User already exists.');
            return res.status(409).json({ error: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating user...');
        const user = await User.create({ username, email, password: hashedPassword, isGardener });

        console.log('Signing token...');
        const token = await signToken({ userId: user._id });

        console.log('Setting cookie...');
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        }));

        console.log('User created successfully.');
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
