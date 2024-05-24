import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) throw new Error('User not authenticated');
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    const renderGardenerDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <Link href={'/profile'} className="btn btn-primary mt-2">Edit Profile</Link>
            </section>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <ul>
                    <li>Product A listed</li>
                    <li>Product B sold</li>
                    <li>New message from User X</li>
                </ul>
            </section>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Quick Actions</h2>
                <button className="btn btn-accent mt-2">Add New Product</button>
                <button className="btn btn-accent mt-2">View Messages</button>
                <button className="btn btn-accent mt-2">Manage Settings</button>
            </section>
            <section className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Statistics</h2>
                <div className="flex justify-around mt-4">
                    <div>
                        <h3 className="text-lg font-semibold">Products Listed</h3>
                        <p>10</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Sales Made</h3>
                        <p>5</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Messages</h3>
                        <p>3</p>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderBuyerDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <Link href={'/profile'} className="btn btn-primary mt-2">Edit Profile</Link>
            </section>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <ul>
                    <li>Order #1234 - Product A</li>
                    <li>Order #5678 - Product B</li>
                </ul>
            </section>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Wishlist</h2>
                <ul>
                    <li>Product A</li>
                    <li>Product B</li>
                </ul>
            </section>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-primary text-white p-4">
                <h1 className="text-3xl">Dashboard</h1>
                {user && <p className="mt-2">Welcome, {user.firstName || user.username}</p>}
            </header>
            <main className="p-4">
                {user ? (
                    <>
                        {user.isGardener ? renderGardenerDashboard() : renderBuyerDashboard()}

                        <section className="col-span-1 md:col-span-3 bg-white p-4 rounded-lg shadow-md mt-4">
                            <h2 className="text-xl font-bold">Support and Help</h2>
                            <p>If you need any help, please contact our support team.</p>
                            <button className="btn btn-primary mt-2">Contact Support</button>
                        </section>
                    </>
                ) : (
                    <p>Please log in to access the dashboard.</p>
                )}
            </main>
        </div>
    );
}
