// pages/api/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import Basket from '@/models/Basket';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookHandler = async (req, res) => {
    await dbConnect();

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error('Error verifying Stripe webhook signature:', err.message);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id; // Assuming user ID is passed as client_reference_id

        try {
            await Basket.findOneAndDelete({ userId });
            console.log(`Basket for user ${userId} deleted successfully.`);
        } catch (error) {
            console.error('Failed to delete basket:', error);
        }
    }

    res.status(200).json({ received: true });
};

export default webhookHandler;
