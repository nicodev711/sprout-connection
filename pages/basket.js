import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useUser } from '@/contexts/UserContext';

const Basket = () => {
    const { state, updateItemQuantity, removeItemFromCart } = useCart();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (state.items) {
            console.log("Basket data:", state.items);
            setLoading(false);
        }
    }, [user, state.items, router]);

    const calculateTotal = () => {
        if (!state.items || !Array.isArray(state.items)) return 0;
        return state.items.reduce((total, item) => {
            const price = parseFloat(item.price || 0);
            const quantity = parseFloat(item.quantity);
            if (isNaN(price) || isNaN(quantity)) {
                console.warn('Invalid price or quantity:', { price, quantity });
                return total;
            }
            return total + (price * quantity);
        }, 0);
    };

    const handleCheckout = async () => {
        try {
            const { data } = await axios.post('/api/checkout', { cart: state.items }, { withCredentials: true });
            if (data && data.url) {
                await router.push(data.url);
            }
        } catch (error) {
            console.error('Failed to redirect to Stripe checkout:', error);
        }
    };

    if (!user) {
        return null; // Return null while redirecting to login
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <Head>
                    <title>Sprout Connections - Basket</title>
                    <meta name="description" content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!" />
                    <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors" />
                    <meta property="og:description" content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!" />
                    <meta property="og:url" content="https://www.sproutconnections.com" />
                </Head>
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-2xl font-bold mb-6 text-green-600">Loading your basket...</h1>
                    <p className="text-gray-500">Please wait a moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Basket</h1>
                {calculateTotal() > 0 && calculateTotal() < 5 && (
                    <div className="toast mb-4">
                        <div className="alert alert-info">
                            <span>Your basket total is below £5. Add more items to avoid an extra £0.30 fee.</span>
                        </div>
                    </div>
                )}

                <ul className="space-y-4">
                    {state.items.length > 0 ? (
                        state.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                                <div>
                                    <h2 className="text-lg font-semibold">{item.title}</h2>
                                    <p className="text-sm text-gray-600">£{item.price} x {item.quantity}</p>
                                    <div className="flex items-center mt-2">
                                        <label htmlFor={`quantity-${index}`} className="mr-2">Quantity:</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            id={`quantity-${index}`}
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(item._id, e.target.value)}
                                            min="0.1"
                                            className="w-16 p-1 border rounded"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm font-semibold">Total: £{(item.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeItemFromCart(item._id)}
                                        className="ml-4 text-red-500 hover:underline mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Your basket is empty</p>
                    )}
                </ul>
                {state.items.length > 0 && (
                    <>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-semibold">Total Amount</p>
                                <p className="text-lg font-bold text-gray-800">£{calculateTotal().toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-semibold">Service Fee</p>
                                <p className="text-lg font-bold text-gray-800">£{(calculateTotal() * 0.1).toFixed(2)}</p>
                            </div>
                            {calculateTotal() < 5 && (
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-lg font-semibold">Small Order Fee</p>
                                    <p className="text-lg font-bold text-gray-800">£0.30</p>
                                </div>
                            )}
                            <div className="flex justify-between items-center border-t pt-2">
                                <p className="text-lg font-semibold">Final Amount</p>
                                <p className="text-lg font-bold text-gray-800">£{(calculateTotal() + (calculateTotal() * 0.1) + (calculateTotal() < 5 ? 0.30 : 0)).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button onClick={handleCheckout}
                                    className="btn btn-primary px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Basket;
