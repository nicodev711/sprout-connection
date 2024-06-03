import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

const RenderGardenerDashboard = () => {
    const { user } = useUser();
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const response = await axios.get('/api/orders/gardener-recent'); // Ensure this endpoint exists
                setRecentOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch recent orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    if (loading) {
        return <p>Loading recent orders...</p>;
    }

    return (
        <section className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <ul>
                {recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                        <li key={order._id} className="mb-2">
                            <Link href={`/orders/${order._id}`} className="text-blue-500 hover:underline">
                                Order #{order._id.slice(-4)} - {order.products.map(p => (
                                `${p.productId.title} (${p.quantity}${p.productId.units ? ` ${p.productId.units}` : ' units'})`
                            )).join(', ')} - {order.status}
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No recent orders.</p>
                )}
            </ul>
        </section>
    );
};

export default RenderGardenerDashboard;
