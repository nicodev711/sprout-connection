import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function handler(req, res) {
    await connectToDatabase();

    const { id } = req.query;

    if (req.method === 'POST') {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ error: 'Insufficient product quantity' });
            }

            product.quantity -= quantity;
            await product.save();

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Failed to purchase product' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
