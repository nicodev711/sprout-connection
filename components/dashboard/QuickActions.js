import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function QuickActions({ user }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(false);
    const [accountStatus, setAccountStatus] = useState('checking');

    useEffect(() => {
        const checkAccountStatus = async () => {
            try {
                const response = await axios.get('/api/stripe/check-account-status');
                setAccountStatus(response.data.accountStatus);
            } catch (error) {
                console.error('Failed to check account status:', error);
                setAccountStatus('error');
            }
        };

        if (user.stripeAccountId) {
            checkAccountStatus();
        }
    }, [user.stripeAccountId]);

    const handleAlert = () => {
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/press-release', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, content }),
        });

        if (response.ok) {
            setTitle('');
            setDescription('');
            setContent('');
            document.getElementById('my_modal_3').close();
            alert('Press release added successfully!');
        } else {
            alert('Failed to add press release.');
        }
    };

    const handleCreateStripeAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/create-stripe-account');
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

    const handleCompleteStripeSetup = async () => {
        setLoading(true);
        setError(null);

        try {
            const deleteResponse = await axios.post('/api/stripe/delete-stripe-account-id');
            if (deleteResponse.status === 200) {
                const response = await axios.post('/api/stripe/create-stripe-account');
                if (response.data.url) {
                    window.location.href = response.data.url; // Redirect to Stripe account onboarding
                } else {
                    setError('Failed to complete Stripe setup');
                }
            } else {
                setError('Failed to delete existing Stripe account ID');
            }
        } catch (error) {
            console.error('Failed to complete Stripe setup:', error);
            setError('Failed to complete Stripe setup');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.stripeAccountId ? (
                    accountStatus === 'complete' ? (
                        <Link href={"/products/add"} className={`btn btn-accent`}>
                            Add New Product
                        </Link>
                    ) : accountStatus === 'incomplete' || accountStatus === 'checking' ? (
                        <Link href={"/products/add"} className={`btn btn-accent disabled`} disabled>
                            Add New Product
                        </Link>
                    ) : (
                        <Link href={"/products/add"} className={`btn btn-accent disabled`} disabled>
                            Add New Product
                        </Link>
                    )
                ) : (
                    <Link href={"/products/add"} className={`btn btn-accent disabled`} disabled>
                        Add New Product
                    </Link>
                )}
                <Link href={"/products/manage"} className="btn btn-accent">Manage Products</Link>
                {user.stripeAccountId ? (
                    accountStatus === 'complete' ? (
                        <Link href={"/products/add"} className={`btn btn-accent hidden`}>
                            Add New Product
                        </Link>
                    ) : accountStatus === 'incomplete' || accountStatus === 'checking' ? (
                        <button
                            onClick={handleCompleteStripeSetup}
                            className="btn btn-accent"
                            disabled={accountStatus === 'checking'}
                        >
                            {accountStatus === 'checking' ? 'Checking account status...' : 'Complete Stripe Setup'}
                        </button>
                    ) : (
                        <Link href={"/products/add"} className={`btn btn-accent disabled hidden`} disabled>
                            Add 2New Product
                        </Link>
                    )
                ) : (
                    <button onClick={handleCreateStripeAccount} className="btn btn-accent">
                        Create Stripe Account
                    </button>
                )}
                <button className="btn btn-accent hidden" disabled>View Messages</button>
                <button className="btn btn-accent hidden" disabled>Manage Settings</button>
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
                                        <ReactQuill
                                            id="content"
                                            value={content}
                                            onChange={setContent}
                                            className="h-40"
                                            required
                                        />
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
