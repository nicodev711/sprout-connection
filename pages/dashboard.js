import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import Support from "@/components/dashboard/Support";
import PressRelease from "@/components/dashboard/PressRelease";
import QuickActions from "@/components/dashboard/QuickActions";
import Statistics from "@/components/dashboard/Statistics";

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
                <p>Name: {user.firstName}</p>
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
            <QuickActions user={user} />
            <Statistics/>
        </div>
    );

    const renderBuyerDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p>Name: {user.firstName}</p>
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

                        <PressRelease/>

                        <Support/>
                    </>
                ) : (
                    <p>Please log in to access the dashboard.</p>
                )}
            </main>
        </div>
    );
}
