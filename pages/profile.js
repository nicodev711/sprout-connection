import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

export default function Profile() {
    const { user, setUser, fetchUser } = useUser();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isGardener, setIsGardener] = useState(false);
    const [postcode, setPostcode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setPostcode(user.postcode);
            setIsGardener(user.isGardener);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let latitude = null;
        let longitude = null;
        if (postcode) {
            const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
            const data = await response.json();
            if (data.status === 200) {
                latitude = data.result.latitude;
                longitude = data.result.longitude;
            } else {
                setError('Invalid postcode');
                return;
            }
        }

        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, firstName, lastName, email, isGardener, postcode, latitude, longitude }),
        });

        if (res.ok) {
            setSuccess('Profile updated successfully');
            setError(null);
            fetchUser(); // Refresh user data
        } else {
            const result = await res.json();
            setError(result.message || 'Failed to update profile');
            setSuccess(null);
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Profile</h1>
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
                        <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                        <label htmlFor="postcode" className="block text-gray-700 mb-2">
                            Postcode
                            {!isGardener &&
                                <span className="block text-sm text-gray-600 mt-1">Set your postcode as default in the search bar</span>}
                        </label>
                        <input
                            id="postcode"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 hidden">
                        <input
                            id="isGardener"
                            type="checkbox"
                            className="mr-2"
                            checked={isGardener}
                            onChange={(e) => setIsGardener(e.target.checked)}
                        />
                        <label htmlFor="isGardener" className="text-gray-700">Register as Gardener</label>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button type="submit"
                            className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}
