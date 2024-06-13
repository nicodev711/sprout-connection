import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Messages from '@/components/Messages';
import { useUser } from '@/contexts/UserContext';

export default function OrderDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useUser();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchOrder = async () => {
                try {
                    const response = await axios.get(`/api/orders/${id}`);
                    setOrder(response.data);
                } catch (error) {
                    console.error('Failed to fetch order:', error);
                    setError('Failed to fetch order');
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
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Order #{order._id.slice(-4)}</h2>
                <p>Status: {order.status}</p>
                <p>Total: £{order.total.toFixed(2)}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Products:</h3>
                    <ul className="list-disc list-inside">
                        {order.products.map((product) => (
                            <li key={product.productId} className="mb-2">
                                <span className="font-semibold">{product.name}</span>: {product.quantity} {product.units} - £{(product.price * product.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Fees:</h3>
                    <p>Service Fee: £{order.serviceFee.toFixed(2)}</p>
                    {order.smallOrderFee > 0 && <p>Small Order Fee: £{order.smallOrderFee.toFixed(2)}</p>}
                </div>
            </div>
            <div className="mt-6">
                <Messages orderId={order._id} userId={user.userId} receiverId={receiverId} />
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
