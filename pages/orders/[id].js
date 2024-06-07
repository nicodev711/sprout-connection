import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Messages from '@/components/Messages';
import { useUser } from '@/contexts/UserContext';
import Head from "next/head";

export default function OrderDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useUser();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchOrder = async () => {
                try {
                    const response = await axios.get(`/api/orders/${id}`);
                    setOrder(response.data);
                } catch (error) {
                    console.error('Failed to fetch order:', error);
                }
            };

            fetchOrder();
        }
    }, [id]);

    if (!order) {
        return <p>Loading...</p>;
    }

    const receiverId = order.gardenerIds.find((gardenerId) => gardenerId !== user.userId);

    return (
        <div className="min-h-screen p-4">
            <Head>
                <title>Sprout Connections - Order Details</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Order #{order._id.slice(-4)}</h2>
                <p>Status: {order.status}</p>
                <p>Total: £{order.total.toFixed(2)}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Products:</h3>
                    <ul className="list-disc list-inside">
                        {order.products.map((product) => (
                            <li key={product.productId._id} className="mb-2">
                                <span className="font-semibold">{product.productId.title}</span>: {product.quantity} {product.productId.units} - £{(product.productId.price * product.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-6">
                <Messages orderId={order._id} userId={user.userId} receiverId={receiverId} />
            </div>
        </div>
    );
}
