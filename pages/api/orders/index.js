// pages/api/index.js
import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';
import Basket from '@/models/Basket';
import User from '@/models/User';

const ordersHandler = async (req, res) => {
    await dbConnect();
    const buyerId = req.user.userId;

    if (req.method === 'POST') {
        try {
            const userBasket = await Basket.findOne({ userId: buyerId }).populate('items.productId');

            if (!userBasket || userBasket.items.length === 0) {
                return res.status(400).json({ error: 'Basket is empty' });
            }

            const gardenerIds = [...new Set(userBasket.items.map(item => item.productId.userId))];
            const products = userBasket.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));
            const totalProductAmount = userBasket.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0).toFixed(2);
            const serviceFee = (totalProductAmount * 0.1).toFixed(2);
            const smallOrderFee = totalProductAmount < 5 ? 0.30 : 0;
            const total = (parseFloat(totalProductAmount) + parseFloat(serviceFee) + parseFloat(smallOrderFee)).toFixed(2);

            const order = new Order({
                buyerId,
                gardenerIds,
                products,
                total: parseFloat(total), // Ensure total is a number with two decimal places
            });

            await order.save();

            // Update the withdrawable amount for each gardener, excluding fees
            await Promise.all(gardenerIds.map(async gardenerId => {
                const gardener = await User.findById(gardenerId);
                if (gardener) {
                    gardener.withdrawableAmount += parseFloat(totalProductAmount);
                    await gardener.save();
                }
            }));

            await Basket.deleteOne({ userId: buyerId }); // Clear the basket after creating the order

            res.status(201).json(order);
        } catch (error) {
            console.error('Failed to create order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, ordersHandler);
};

export default handler;
