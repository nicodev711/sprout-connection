import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import axios from "axios";
import {router} from "next/client";

const Basket = () => {
    const { basket } = useUser();

    // Calculate total, service fee, and final amount
    const calculateTotal = () => {
        if (!basket || !Array.isArray(basket)) return 0;
        return basket.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    };

    const totalAmount = calculateTotal();
    const serviceFee = totalAmount * 0.05;
    const finalAmount = totalAmount + serviceFee;

    const handleCheckout = async () => {
        try {
            const { data } = await axios.post('/api/checkout', {}, { withCredentials: true });
            router.push(data.url);
        } catch (error) {
            console.error('Failed to redirect to Stripe checkout:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Basket</h1>
                <ul className="space-y-4">
                    {basket.length > 0 ? (
                        basket.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                                <div>
                                    <h2 className="text-lg font-semibold">{item.productId.title}</h2>
                                    <p className="text-sm text-gray-600">${item.productId.price} x {item.quantity}</p>
                                </div>
                                <p className="text-lg font-bold text-gray-800">
                                    ${item.productId.price * item.quantity}
                                </p>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Your basket is empty</p>
                    )}
                </ul>
                {basket.length > 0 && (
                    <>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-semibold">Total Amount</p>
                                <p className="text-lg font-bold text-gray-800">${totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-semibold">Service Fee (5%)</p>
                                <p className="text-lg font-bold text-gray-800">${serviceFee.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2">
                                <p className="text-lg font-semibold">Final Amount</p>
                                <p className="text-lg font-bold text-gray-800">${finalAmount.toFixed(2)}</p>
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
