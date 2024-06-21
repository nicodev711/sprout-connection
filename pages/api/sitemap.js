// pages/api/sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

const sitemapHandler = async (req, res) => {
    await connectToDatabase();

    try {
        const products = await Product.find({ isListed: true });

        // Create a stream to write to
        const stream = new SitemapStream({ hostname: 'https://www.sproutconnections.com' });

        // Add static routes
        stream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
        stream.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
        stream.write({ url: '/contact', changefreq: 'monthly', priority: 0.7 });

        // Add dynamic product routes
        products.forEach(product => {
            stream.write({
                url: `/products/${product._id}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: product.modifiedAt || product.createdAt
            });
        });

        // End the stream
        stream.end();

        // Convert the stream to a promise
        const sitemap = await streamToPromise(Readable.from(stream)).then(data => data.toString());

        res.setHeader('Content-Type', 'application/xml');
        res.write(sitemap);
        res.end();
    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
};

export default sitemapHandler;
