import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    const sessionId = req.query.session_id;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
        await dbConnect();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const userId = session.metadata.userId;
        const cart = JSON.parse(session.metadata.cart);

        const gardenerIds = [...new Set(cart.map(item => item.userId.toString()))];
        const totalProductAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

        const products = cart.map(item => ({
            productId: item._id,
            name: item.title,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            units: item.units,
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

        // Redirect to success page
        res.writeHead(302, { Location: '/success' });
        res.end();
    } catch (error) {
        console.error('Failed to retrieve session or create order:', error);
        res.status(500).json({ error: 'Failed to retrieve session or create order' });
    }
};

export default handler;
