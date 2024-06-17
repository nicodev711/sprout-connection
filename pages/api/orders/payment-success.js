import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    const sessionId = req.query.session_id;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Redirect to success page
        res.writeHead(302, { Location: '/success' });
        res.end();
    } catch (error) {
        console.error('Failed to retrieve session:', error);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
};

export default handler;
