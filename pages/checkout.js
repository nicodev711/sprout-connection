import { useUser } from '@/contexts/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const { user, basket, clearBasket } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        console.log('Stripe:', stripePromise);
        console.log('User:', user);
        console.log('Basket:', basket);

        const stripe = await stripePromise;

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: basket.map(item => ({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.title,
                            },
                            unit_amount: item.price * 100,
                        },
                        quantity: item.quantity,
                    })),
                    customer_email: user.email,
                }),
            });

            console.log('Response from create-checkout-session:', response);

            const session = await response.json();

            console.log('Session:', session);

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            console.log('Redirect to Checkout result:', result);

            if (result.error) {
                setError(result.error.message);
                console.error('Error in redirectToCheckout:', result.error);
            } else {
                clearBasket();
                console.log('Basket cleared');
            }
        } catch (err) {
            setError('Failed to create checkout session');
            console.error('Error in handleCheckout:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Loading...' : 'Proceed to Checkout'}
            </button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Checkout;
