import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req, res) {
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password, isGardener } = req.body;

    if (!username || !email || !password) {
        console.log('Missing fields:', { username, email, password });
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        console.time('Database connection');
        await connectToDatabase();
        console.timeEnd('Database connection');

        console.time('Check existing user');
        const existingUser = await User.findOne({ email });
        console.timeEnd('Check existing user');

        if (existingUser) {
            console.log('User already exists.');
            return res.status(409).json({ error: 'User already exists' });
        }

        console.time('Hash password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.timeEnd('Hash password');

        console.time('Create user');
        const user = await User.create({ username, email, password: hashedPassword, isGardener });
        console.timeEnd('Create user');

        console.time('Sign token');
        const token = await signToken({ userId: user._id });
        console.timeEnd('Sign token');

        console.time('Set cookie');
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: true, // Secure should be true in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        }));
        console.timeEnd('Set cookie');

        console.log('User created successfully.');
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        console.error('Error during user registration:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
