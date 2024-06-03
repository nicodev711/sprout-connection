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
            // Use regex to match partial strings case-insensitively
            searchCriteria.title = { $regex: query, $options: 'i' };
        }

        if (category && category !== 'Filter') {
            searchCriteria.category = category;
        }

        let products = await Product.find(searchCriteria);

        // Filter by postcode and range
        if (postcode) {
            const userPostcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
            const userPostcodeData = await userPostcodeResponse.json();

            if (userPostcodeData.status === 200) {
                const userLocation = {
                    latitude: userPostcodeData.result.latitude,
                    longitude: userPostcodeData.result.longitude
                };

                products = products.filter(product => {
                    const distance = getDistance(
                        { latitude: product.latitude, longitude: product.longitude },
                        userLocation
                    );
                    // Convert distance to miles and check if it's within the specified range
                    return distance <= range * 1609.34; // 1 mile = 1609.34 meters
                });
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
