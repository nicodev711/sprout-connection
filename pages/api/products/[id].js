import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { authMiddleware } from '@/lib/middleware';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const idHandler = async (req, res) => {
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
    } else if (req.method === 'PUT' || req.method === 'DELETE') {
        await authMiddleware(req, res, async () => {
            if (req.method === 'PUT') {
                const { title, description, quantity, units, price, isListed, isDelivered, imageCDNLink, unitType } = req.body;

                try {
                    const updatedProduct = await Product.findByIdAndUpdate(
                        id,
                        { title, description, quantity, units, price, isListed, isDelivered, imageCDNLink, unitType },
                        { new: true }
                    );
                    res.status(200).json(updatedProduct);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to update product' });
                }
            } else if (req.method === 'DELETE') {
                try {
                    const product = await Product.findById(id);
                    if (!product) {
                        return res.status(404).json({ error: 'Product not found' });
                    }

                    // Delete image from Cloudinary
                    if (product.imageCDNLink) {
                        const publicId = `sproutConnection/${product.imageCDNLink.split('/').pop().split('.')[0]}`;
                        await cloudinary.uploader.destroy(publicId);
                    }

                    await Product.findByIdAndDelete(id);
                    res.status(204).end();
                } catch (error) {
                    res.status(500).json({ error: 'Failed to delete product' });
                }
            } else {
                res.status(405).json({ error: 'Method not allowed' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default idHandler;
