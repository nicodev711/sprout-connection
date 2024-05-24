// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isGardener, setIsGardener] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!email || !username || !password) {
            setError('All fields are required');
            return;
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, isGardener }),
        });

        if (res.ok) {
            router.push('/login');
        } else {
            const result = await res.json();
            setError(result.message || 'Failed to register');
        }
    };

    return (
        <div>
            <h1>Register</h1>
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
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
