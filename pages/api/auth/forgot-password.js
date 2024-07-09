import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = resetTokenExpiry;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com', // Brevo SMTP server
            port: 587, // Brevo SMTP port
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_USER, // Your Brevo SMTP username
                pass: process.env.BREVO_PASS, // Your Brevo SMTP password
            },
        });

        // const mailOptions = {
        //     from: process.env.BREVO_USER,
        //     to: 'recipient@example.com',
        //     subject: 'Test Email',
        //     text: 'This is a test email.',
        // };

        const mailOptions = {
            to: user.email,
            from: process.env.BREVO_USER,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                `${process.env.BASE_URL}/reset-password?token=${resetToken}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Failed to send reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
}
