import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import Head from "next/head";


const Success = () => {
    const { clearBasket } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Clear the basket when this page is loaded
        clearBasket();

        // Redirect to dashboard after a short delay
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 5000); // 5 seconds delay

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, [clearBasket, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <Head>
                <title>Sprout Connections - Payment Successful</title>
                <meta name="description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:title" content="Sprout Connections - Fresh Garden Produce from Your Neighbors"/>
                <meta property="og:description"
                      content="Buy and sell fresh, locally-grown produce directly from gardeners in your community. Join Sprout Connections today!"/>
                <meta property="og:url" content="https://www.sproutconnections.com"/>
            </Head>
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-6 text-green-600">Payment Successful!</h1>
                <p className="text-lg mb-4">Thank you for your purchase. Your order will be processed shortly.</p>
                <p className="text-lg mb-4">You will be redirected to your dashboard shortly.</p>
                <Link href='/dashboard'>
                    <a className="btn btn-primary px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300">
                        Back to Dashboard
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Success;
