import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import Basket from '@/models/Basket';
import Order from '@/models/Order';
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookHandler = async (req, res) => {
    await dbConnect();

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        try {
            const userBasket = await Basket.findOne({ userId }).populate('items.productId');

            const gardenerIds = [...new Set(userBasket.items.map(item => item.productId.userId.toString()))];
            const totalProductAmount = userBasket.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0).toFixed(2);

            const products = userBasket.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.title,
                price: item.productId.price,
                quantity: item.quantity,
                total: item.productId.price * item.quantity,
                units: item.productId.units,
            }));

            const serviceFee = (totalProductAmount * 0.1).toFixed(2);
            const smallOrderFee = totalProductAmount < 5 ? 0.30 : 0;
            const total = (parseFloat(totalProductAmount) + parseFloat(serviceFee) + parseFloat(smallOrderFee)).toFixed(2);

            const order = new Order({
                buyerId: userId,
                gardenerIds,
                products,
                totalProductAmount: parseFloat(totalProductAmount),
                serviceFee: parseFloat(serviceFee),
                smallOrderFee: parseFloat(smallOrderFee),
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

            await Basket.deleteOne({ userId }); // Clear the basket after creating the order
        } catch (error) {
            console.error('Failed to create order:', error);
        }
    }

    res.status(200).json({ received: true });
};

export default webhookHandler;
