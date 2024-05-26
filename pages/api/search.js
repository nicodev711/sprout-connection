import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function handler(req, res) {
    await connectToDatabase();

    const { query, category } = req.query;

    try {
        const searchCriteria = {};

        if (query) {
            // Use regex to match partial strings case-insensitively
            searchCriteria.title = { $regex: query, $options: 'i' };
        }

        if (category && category !== 'Filter') {
            searchCriteria.category = category;
        }

        const results = await Product.find(searchCriteria);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
}
