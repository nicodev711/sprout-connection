import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';

export default function QuickActions({ user }) {
    const [stripeAccountStatus, setStripeAccountStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const checkStripeAccountStatus = async () => {
            try {
                const response = await axios.get('/api/stripe/check-account-status');
                setStripeAccountStatus(response.data.accountStatus);
            } catch (error) {
                console.error('Failed to check Stripe account status:', error);
            }
        };

        if (user.stripeAccountId) {
            checkStripeAccountStatus();
        }
    }, [user.stripeAccountId]);

    const handleAlert = () => {
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 5000);
    };

    const handleCreateStripeAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/stripe/create-stripe-account');
            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Stripe account onboarding
            } else {
                setError('Failed to create Stripe account');
            }
        } catch (error) {
            console.error('Failed to create Stripe account:', error);
            setError('Failed to create Stripe account');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteStripeProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/stripe/create-stripe-account');
            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Stripe account onboarding
            } else {
                setError('Failed to complete Stripe profile');
            }
        } catch (error) {
            console.error('Failed to complete Stripe profile:', error);
            setError('Failed to complete Stripe profile');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawFunds = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/withdraw-funds');
            alert('Withdrawal initiated successfully');
        } catch (error) {
            console.error('Failed to withdraw funds:', error);
            setError('Failed to withdraw funds');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
            {alert && (
                <div role="alert" className="alert alert-warning flex items-center p-2 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>You need to complete your profile before posting your first product</span>
                </div>
            )}
            {successMessage && (
                <div role="alert" className="alert alert-success flex items-center p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                    <span>{successMessage}</span>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.stripeAccountId ? (
                    <>
                        {stripeAccountStatus === 'complete' ? (
                            <Link href={"/products/add"} className={`btn btn-accent`}>
                                Add New Product
                            </Link>
                        ) : (
                            <Link href={"/products/add"} className={`btn btn-accent disabled`} disabled>
                                Add New Product
                            </Link>
                        )}
                    </>
                ) : (
                    <button onClick={handleAlert} className="btn btn-accent" disabled>
                        Add New Product
                    </button>
                )}
                <Link href={"/products/manage"} className="btn btn-accent">Manage Products</Link>
                <button className="btn btn-accent" disabled>View Messages</button>
                <button className="btn btn-accent" disabled>Manage Settings</button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {user.isAdmin && (
                <>
                    <button
                        className="btn btn-accent"
                        onClick={() => document.getElementById('my_modal_3').showModal()}
                    >
                        Add Press Release
                    </button>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form onSubmit={handleSubmit}>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    onClick={() => document.getElementById('my_modal_3').close()}
                                >
                                    ✕
                                </button>
                                <h3 className="font-bold text-lg">Add Press Release</h3>
                                <div className="py-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            className="input input-bordered w-full"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            className="textarea textarea-bordered w-full"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="content">
                                            Content
                                        </label>
                                        <textarea
                                            id="content"
                                            className="textarea textarea-bordered w-full"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-accent mt-2">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </dialog>
                </>
            )}
        </section>
    );
}
