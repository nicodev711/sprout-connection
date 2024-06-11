// pages/api/profile.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';
import fetch from 'node-fetch'; // Make sure node-fetch is installed in your project

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).end();
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

        const { username, firstName, lastName, email, isGardener, postcode } = req.body;
        console.log(postcode)

        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        await connectToDatabase();

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch latitude and longitude from postcodes.io
        let latitude = null;
        let longitude = null;
        if (postcode) {
            const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
            const data = await response.json();
            if (data.status === 200) {
                console.log(`lat:${data.result.latitude}, long: ${data.result.longitude}`)
                latitude = data.result.latitude;
                longitude = data.result.longitude;
            } else {
                res.json({message: "error happened"})
            }
        }

        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.isGardener = isGardener;
        user.postcode = postcode;
        user.latitude = latitude;
        user.longitude = longitude;
        console.log(`user updated: ${user}`)
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
