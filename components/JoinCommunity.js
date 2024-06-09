import { useState } from 'react';
import axios from 'axios';

export default function JoinCommunity() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/JoinCommunity', { name, email });
            setSuccess('Thank you for joining our community!');
            setError(null);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('This email already exist.');
            } else {
                setError('There was an error signing up. Please try again.');
            }
            setSuccess(null);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse lg:justify-between">
                <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold">Join Our Community</h1>
                    <p className="py-6">
                        Be the first to know when we launch and get exclusive early access benefits!
                    </p>
                    <ul className="list-disc text-left space-y-4 pl-6">
                        <li className="flex items-center">
                            <i className="fas fa-star text-primary text-2xl mr-2"></i>
                            <span>Exclusive early access to new features</span>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-calendar-alt text-primary text-2xl mr-2"></i>
                            <span>Updates on our progress and launch date</span>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-tags text-primary text-2xl mr-2"></i>
                            <span>Special offers and discounts</span>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-users text-primary text-2xl mr-2"></i>
                            <span>Be part of a community of garden enthusiasts</span>
                        </li>
                    </ul>
                </div>
                <div className="card w-full max-w-sm shadow-2xl bg-base-100 lg:w-1/2">
                    <form onSubmit={handleSubmit} className="card-body">
                        <div className="form-control mb-4">
                            <label className="label" htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input input-bordered w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label" htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Sign Up</button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        {success && <p className="text-green-500 mt-4">{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
