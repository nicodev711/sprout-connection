import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await signToken({ userId: user._id });

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=7200`);

    res.status(200).json({ message: 'Login successful' });
}
