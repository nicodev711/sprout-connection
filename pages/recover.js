import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function PasswordResetPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { token } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/auth/reset-password', {
                token,
                password,
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                router.push('/login');
            }, 3000); // Redirect to login page after 3 seconds
        } catch (error) {
            setError('Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Reset Your Password</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            New Password:
                            <input
                                className="block text-gray-700 mb-2"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Confirm New Password:
                            <input
                                className="block text-gray-700 mb-2"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

