import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import fetch from 'node-fetch';
import { getDistance } from 'geolib';

export default async function handler(req, res) {
    await connectToDatabase();

    const { query, category, postcode, range = 5 } = req.query;

    try {
        const searchCriteria = {};

        if (query) {
            searchCriteria.title = { $regex: query, $options: 'i' };
        }

        if (category && category !== 'Filter') {
            searchCriteria.category = category;
        }

        let products = await Product.find(searchCriteria).lean();

        if (postcode) {
            const userPostcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
            const userPostcodeData = await userPostcodeResponse.json();

            if (userPostcodeData.status === 200) {
                const userLocation = {
                    latitude: userPostcodeData.result.latitude,
                    longitude: userPostcodeData.result.longitude
                };

                products = products.map(product => {
                    const distance = getDistance(
                        { latitude: product.latitude, longitude: product.longitude },
                        userLocation
                    );
                    return {
                        ...product,
                        distance: distance / 1609.34 // Convert distance to miles
                    };
                });

                products = products.filter(product => product.distance <= range);
            } else {
                return res.status(400).json({ error: 'Invalid postcode' });
            }
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
}
