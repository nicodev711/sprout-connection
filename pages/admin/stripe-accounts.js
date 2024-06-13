// pages/admin/stripe-accounts.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBan, FaDollarSign } from 'react-icons/fa';

export default function AdminStripeAccounts() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/stripe-accounts', { withCredentials: true });
                setUsers(response.data.users);
            } catch (error) {
                console.error('Failed to fetch users and Stripe accounts:', error);
                setError('Failed to fetch users and Stripe accounts');
            }
        };

        fetchUsers();
    }, []);

    const handleBlockAccount = async (userId) => {
        try {
            await axios.post('/api/admin/block-user', { userId });
            setUsers(users.map(user =>
                user.userId === userId ? { ...user, isBlocked: true } : user
            ));
        } catch (error) {
            console.error('Failed to block account:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response ? error.response.data : 'No response data',
                status: error.response ? error.response.status : 'No status code',
            });
            setError('Failed to block account');
        }
    };


    const handleDeleteAccount = async (userId) => {
        try {
            await axios.delete('/api/admin/delete-user', {
                data: { userId }
            });
            setUsers(users.filter(user => user.userId !== userId));
        } catch (error) {
            console.error('Failed to delete account:', error);
            setError('Failed to delete account');
        }
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Manage Users and Stripe Accounts</h2>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Account Status</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userId}>
                        <td className="border px-4 py-2">
                            {user.username}
                            {user.isBlocked && <FaBan className="inline text-red-500 ml-2" />}
                            {user.inDatabase && user.inStripe && <FaDollarSign className="inline text-green-500 ml-2" />}
                            {!user.inDatabase && user.inStripe && <span className="ml-2">(Stripe)</span>}
                        </td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => handleBlockAccount(user.userId)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                                disabled={user.isBlocked}
                            >
                                Block
                            </button>
                            <button
                                onClick={() => handleDeleteAccount(user.userId)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}
