import connectToDatabase from '@/lib/mongoose';
import PressRelease from '@/models/Press';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'GET') {
        try {
            const pressReleases = await PressRelease.find({});
            res.status(200).json(pressReleases);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch press releases' });
        }
    } else if (req.method === 'POST') {
        const { title, description, content } = req.body;

        if (!title || !description || !content) {
            return res.status(400).json({ error: 'Title, description, and content are required' });
        }

        try {
            const newPressRelease = new PressRelease({ title, description, content });
            await newPressRelease.save();
            res.status(201).json(newPressRelease);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create press release' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
