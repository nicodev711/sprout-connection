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

        // Create a transporter using GoDaddy's SMTP server
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net', // GoDaddy SMTP server
            port: 587, // GoDaddy SMTP port (usually 587 or 465)
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GODADDY_EMAIL_USER, // Your GoDaddy email username
                pass: process.env.GODADDY_EMAIL_PASS, // Your GoDaddy email password
            },
        });

        // Function to send the recovery email
        const sendRecoveryEmail = async (toEmail, recoveryLink) => {
            const mailOptions = {
                from: process.env.GODADDY_EMAIL_USER, // Sender address
                to: toEmail, // Recipient address
                subject: 'Password Recovery',
                text: `Click the following link to reset your password: ${recoveryLink}`,
                html: `<p>Click the following link to reset your password: <a href="${recoveryLink}">${recoveryLink}</a></p>`,
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.response);
            } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email');
            }
        };

        // Generate the recovery link and send the email
        const recoveryLink = `http://localhost:3000/recover?token=${resetToken}`;
        await sendRecoveryEmail(email, recoveryLink);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Failed to send reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
}
