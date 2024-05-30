// pages/success.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import Link from "next/link";

const Success = () => {
    const { user, basket, clearBasket } = useUser();
    const router = useRouter();

    useEffect(() => {
        const createOrder = async () => {
            try {
                const orderData = {
                    buyerId: user.userId,
                    items: basket,
                    total: basket.reduce((total, item) => total + item.productId.price * item.quantity, 0)
                };
                await axios.post('/api/orders', orderData);
                clearBasket();
            } catch (error) {
                console.error('Failed to create order:', error);
            }
        };

        if (user && basket.length > 0) {
            createOrder();
        }
    }, [user, basket, clearBasket]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-6 text-green-600">Payment Successful!</h1>
                <p className="text-lg mb-4">Thank you for your purchase. Your order will be processed shortly.</p>
                <Link href='/dashboard' className="btn btn-primary px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Success;
