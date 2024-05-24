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
            setError('There was an error signing up. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <section className="py-16 text-center bg-neutral" id="signup">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <p className="mt-4 text-lg">Be the first to know when we launch and get exclusive early access benefits!</p>
            <div className="flex flex-wrap justify-center mt-8">
                <div className="w-full max-w-md mx-auto">
                    <ul className="list-disc text-left px-8 py-4 bg-white rounded-lg shadow-lg space-y-4">
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
            </div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-lg space-y-4">
                <div className="form-control">
                    <label className="label" htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" className="input input-bordered w-full"
                           value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" className="input input-bordered w-full"
                           value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary w-full">Sign Up</button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </form>
        </section>
    );
}
