import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isGardener, setIsGardener] = useState(false);
    const [password, setPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms || !acceptedPrivacyPolicy) {
            setError('You must accept the terms and privacy policy');
            return;
        }

        try {
            const res = await axios.post('/api/auth/register', {
                username,
                email,
                password,
                isGardener,
                acceptedTerms,
                acceptedPrivacyPolicy,
            });

            if (res.status === 201) {
                router.push('/login');
            } else {
                throw new Error(res.data.error || 'Failed to register');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            id="isGardener"
                            type="checkbox"
                            className="mr-2"
                            checked={isGardener}
                            onChange={(e) => setIsGardener(e.target.checked)}
                        />
                        <label htmlFor="isGardener" className="text-gray-700">Register as Gardener</label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            id="acceptedTerms"
                            type="checkbox"
                            className="mr-2"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <label htmlFor="acceptedTerms" className="text-gray-700">I accept the <Link href="/terms"
                                                                                                    className="text-green-600 hover:underline">Terms
                            and Conditions</Link></label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            id="acceptedPrivacyPolicy"
                            type="checkbox"
                            className="mr-2"
                            checked={acceptedPrivacyPolicy}
                            onChange={(e) => setAcceptedPrivacyPolicy(e.target.checked)}
                        />
                        <label htmlFor="acceptedPrivacyPolicy" className="text-gray-700">I accept the <Link
                            href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link></label>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button type="submit"
                            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-300 ${
                                acceptedTerms && acceptedPrivacyPolicy ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!acceptedTerms || !acceptedPrivacyPolicy}
                            title={!acceptedTerms || !acceptedPrivacyPolicy ? "You must accept the terms and privacy policy to register." : "Click to register"}>
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">Already having an account? <Link href="/login"
                                                                                 className="text-green-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
