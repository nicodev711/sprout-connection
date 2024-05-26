import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Stripe from "stripe";

const Checkout = () => {
    const [basket, setBasket] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
        setBasket(storedBasket);
        const totalAmount = storedBasket.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(totalAmount);
    }, []);

    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/checkout', { basket });
            const { sessionId } = response.data;
            const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            {basket.length === 0 ? (
                <p>Your basket is empty.</p>
            ) : (
                <div>
                    {basket.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg mb-4">
                            <div className="flex items-center">
                                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg mr-4" />
                                <div>
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <p>${item.price} per {item.units}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p>Total: ${item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <div className="text-right mt-4">
                        <h2 className="text-2xl font-bold">Total Amount: ${total}</h2>
                    </div>
                    <button className="btn btn-primary w-full mt-4" onClick={handlePayment}>
                        Pay with Stripe
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
