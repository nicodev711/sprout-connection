import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { authMiddleware } from '@/lib/middleware';

const handler = async (req, res) => {
    await connectToDatabase();
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    } else if (req.method === 'PUT') {
        const { title, description, quantity, units, price, isListed, isDelivered, imageCDNLink } = req.body;

        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { title, description, quantity, units, price, isListed, isDelivered, imageCDNLink },
                { new: true }
            );
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update product' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await Product.findByIdAndDelete(id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default (req, res) => authMiddleware(req, res, () => handler(req, res));
