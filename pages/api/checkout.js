// pages/api/checkout.js
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
            console.error('Basket is empty or not found');
            return res.status(400).json({ error: 'Basket is empty' });
        }

        const gardenerIds = [...new Set(userBasket.items.map(item => item.productId.userId.toString()))];

        if (gardenerIds.length === 0) {
            console.error('No gardener IDs found');
            return res.status(400).json({ error: 'No gardener IDs found' });
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
        const fees = process.env.PLATEFORM_FEES
        const smallFees = process.env.SMALL_PLATEFORM_FEE
        const minOrder = process.env.MIN_ORDER
        const totalProductAmount = userBasket.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0).toFixed(2);
        const serviceFee = (totalProductAmount * fees).toFixed(2);
        const smallOrderFee = totalProductAmount < minOrder ? smallFees : 0;
        const total = (parseFloat(totalProductAmount) + parseFloat(serviceFee) + parseFloat(smallOrderFee)).toFixed(2);

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

        const gardener = await User.findById(gardenerIds[0]);
        if (!gardener) {
            console.error('Gardener not found');
            return res.status(400).json({ error: 'Gardener not found' });
        }

        if (!gardener.stripeAccountId) {
            console.error('Gardener does not have a Stripe account');
            return res.status(400).json({ error: 'Gardener does not have a Stripe account' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
            payment_intent_data: {
                application_fee_amount: Math.round((parseFloat(serviceFee) + parseFloat(smallOrderFee)) * 100), // Platform fee in cents
                transfer_data: {
                    destination: gardener.stripeAccountId,
                },
            },
        });

        // Create order here
        const products = userBasket.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
        }));

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
