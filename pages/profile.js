// pages/profile.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isGardener, setIsGardener] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setUsername(data.user.username);
                setFirstName(data.user.firstName);
                setLastName(data.user.lastName);
                setEmail(data.user.email);
                setIsGardener(data.user.isGardener);
            } else {
                router.push('/login');
            }
        }

        fetchUser();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, firstName, lastName, email, isGardener }),
        });

        if (res.ok) {
            setSuccess('Profile updated successfully');
        } else {
            const result = await res.json();
            setError(result.message || 'Failed to update profile');
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="isGardener">Register as Gardener</label>
                    <input
                        id="isGardener"
                        type="checkbox"
                        checked={isGardener}
                        onChange={(e) => setIsGardener(e.target.checked)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}
