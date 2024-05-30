import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import Basket from '@/models/Basket';
import Stripe from 'stripe';
import User from "@/models/User";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const userBasket = await Basket.findOne({ userId }).populate('items.productId');

        if (!userBasket || userBasket.items.length === 0) {
            return res.status(400).json({ error: 'Basket is empty' });
        }

        const lineItems = userBasket.items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.productId.title,
                },
                unit_amount: item.productId.price * 100,
            },
            quantity: item.quantity,
        }));

        const totalAmount = userBasket.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
        const serviceFee = totalAmount * 0.1;
        const smallOrderFee = totalAmount < 5 ? 0.30 : 0;

        lineItems.push({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: 'Service Fee',
                },
                unit_amount: Math.round(serviceFee * 100),
            },
            quantity: 1,
        });

        if (smallOrderFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Small Order Fee',
                    },
                    unit_amount: Math.round(smallOrderFee * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        // Create order here
        const gardenerIds = [...new Set(userBasket.items.map(item => item.productId.userId))];
        const products = userBasket.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
        }));
        const totalProductAmount = userBasket.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0).toFixed(2);
        const total = (parseFloat(totalProductAmount) + parseFloat(serviceFee) + parseFloat(smallOrderFee)).toFixed(2);

        const order = new Order({
            buyerId: userId,
            gardenerIds,
            products,
            total: parseFloat(total),
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

        await Basket.deleteOne({ userId });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Failed to create checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

const handler = async (req, res) => {
    await authMiddleware(req, res, checkoutHandler);
};

export default handler;
