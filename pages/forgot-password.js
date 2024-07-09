import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            setSuccess('Password reset email sent. Please check your inbox.');
            setError(null);
        } else {
            const result = await res.json();
            setError(result.message || 'Failed to send password reset email');
            setSuccess(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Head>
                <title>Sprout Connections - Forgot Password</title>
            </Head>
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
                        Send Reset Link
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Remember your password? <Link href="/login" className="text-green-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
