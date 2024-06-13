import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import Support from "@/components/dashboard/Support";
import PressRelease from "@/components/dashboard/PressRelease";
import QuickActions from "@/components/dashboard/QuickActions";
import Statistics from "@/components/dashboard/Statistics";
import RecentOrdersBuyer from "@/components/dashboard/RecentOrdersBuyer";
import RecentOrdersGardener from "@/components/dashboard/RecentOrdersGardener";
import Image from 'next/image';
import styles from '@/styles/Modal.module.css';
import Head from "next/head"; // Import custom styles

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [animationCount, setAnimationCount] = useState(0);
    const maxAnimationCount = 5;
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) throw new Error('User not authenticated');
                const data = await response.json();
                setUser(data.user);

                if (router.query.registered === 'true' && data.user.isGardener) {
                    setShowModal(true);
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (showModal && animationCount < maxAnimationCount) {
            const interval = setInterval(() => {
                setAnimationCount((prevCount) => prevCount + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showModal, animationCount]);

    if (loading) return <p>Loading...</p>;

    const renderGardenerDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p>Name: {user.firstName}</p>
                <p>Email: {user.email}</p>
                <Link href={'/profile'} className="btn btn-primary mt-2">Edit Profile</Link>
            </section>
            <RecentOrdersGardener />
            <QuickActions user={user} />
            <Statistics />
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
            <RecentOrdersBuyer />
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
            <Head>
                <title>Sprout Connections - Dashboard</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <header className="bg-primary text-white p-4">
                <h1 className="text-3xl">Dashboard</h1>
                {user && <p className="mt-2">Welcome, {user.firstName || user.username}</p>}
            </header>
            <main className="p-4">
                {user ? (
                    <>
                        {user.isGardener ? renderGardenerDashboard() : renderBuyerDashboard()}
                        <PressRelease />
                        <Support />
                    </>
                ) : (
                    <p>Please log in to access the dashboard.</p>
                )}
            </main>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`bg-white p-8 rounded-lg shadow-lg text-center ${animationCount < maxAnimationCount ? styles.modal : ''}`}>
                        <Image
                            src="/ModalGardener-Copy.png" // Ensure this path matches where you saved the image
                            alt="Gardening Icon"
                            width={300}
                            height={300}
                            className="mx-auto"
                        />
                        <h2 className="text-2xl font-bold mb-4 mt-2 text-green-600">Congratulations!</h2>
                        <p>You have successfully registered as a Gardener.</p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
