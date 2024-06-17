import { authMiddleware } from '@/lib/middleware';
import dbConnect from '@/lib/mongoose';
import Stripe from 'stripe';
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutHandler = async (req, res) => {
    await dbConnect();
    const userId = req.user.userId;

    try {
        const { cart } = req.body;

        if (!cart || cart.length === 0) {
            console.error('Cart is empty or not provided');
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const gardenerIds = [...new Set(cart.map(item => item.userId.toString()))];

        if (gardenerIds.length === 0) {
            console.error('No gardener IDs found');
            return res.status(400).json({ error: 'No gardener IDs found' });
        }

        const factor = 10; // Factor to convert quantity to integer
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.title,
                    description: `£${item.price.toFixed(2)} per ${item.units} (Total Qty: ${item.quantity})`,
                },
                unit_amount: Math.round(item.price * item.quantity * 100), // Adjusted total price in pence
            },
            quantity: 1, // Always set quantity to 1
        }));

        const totalProductAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        const serviceFee = (totalProductAmount * 0.1).toFixed(2);
        const smallOrderFee = totalProductAmount < 5 ? 0.30 : 0;
        const total = (parseFloat(totalProductAmount) + parseFloat(serviceFee) + parseFloat(smallOrderFee)).toFixed(2);

        lineItems.push({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: 'Service Fee',
                },
                unit_amount: Math.round(parseFloat(serviceFee) * 100), // service fee in pence
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
                    unit_amount: Math.round(smallOrderFee * 100), // small order fee in pence
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
            success_url: `${req.headers.origin}/api/orders/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
            metadata: {
                userId: userId,
                cart: JSON.stringify(cart), // Include cart data as metadata
            },
            payment_intent_data: {
                application_fee_amount: Math.round((parseFloat(serviceFee) + parseFloat(smallOrderFee)) * 100), // Platform fee in pence
                transfer_data: {
                    destination: gardener.stripeAccountId,
                },
            },
        });

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
