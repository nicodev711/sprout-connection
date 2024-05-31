import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { authMiddleware } from '@/lib/middleware';

const indexHandler = async (req, res) => {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { title, description, quantity, units, price, category, imageCDNLink } = req.body;

        if (!title || !description || !units || !price || !category) {
            return res.status(400).json({ error: 'All fields except imageCDNLink are required' });
        }

        try {
            const newProduct = new Product({
                title,
                description,
                userId: req.user.userId, // Use the userId from the authenticated user
                quantity,
                units,
                price,
                category,
                imageCDNLink: imageCDNLink || '', // Ensure this can be empty or null
                isListed: true,
                isDelivered: false,
            });
            await newProduct.save();
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error('Failed to create product:', error);
            return res.status(500).json({ error: 'Failed to create product' });
        }
    } else if (req.method === 'GET') {
        try {
            const products = await Product.find({ isListed: true });
            return res.status(200).json(products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, indexHandler);
};

export default handler;