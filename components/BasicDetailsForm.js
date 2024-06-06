import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

export default function BasicDetailsForm({ handleChange, userData, nextStep }) {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userData.isGardener) {
            nextStep();
        } else {
            try {
                const response = await axios.post('/api/auth/register', {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    isGardener: userData.isGardener,
                });

                if (response.status === 201) {
                    router.push('/login');
                } else {
                    throw new Error(response.data.error || 'Failed to register');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Failed to register. Please try again.');
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={userData.username}
                        onChange={handleChange('username')}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={userData.email}
                        onChange={handleChange('email')}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={userData.password}
                        onChange={handleChange('password')}
                        required
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        id="isGardener"
                        type="checkbox"
                        className="mr-2"
                        checked={userData.isGardener}
                        onChange={handleChange('isGardener')}
                    />
                    <label htmlFor="isGardener" className="text-gray-700">Register as Gardener</label>
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        id="acceptedTerms"
                        type="checkbox"
                        className="mr-2"
                        checked={userData.acceptedTerms}
                        onChange={handleChange('acceptedTerms')}
                    />
                    <label htmlFor="acceptedTerms" className="text-gray-700">
                        I accept the <Link href="/terms-and-conditions" className="text-green-600 hover:underline">Terms and Conditions</Link>
                    </label>
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        id="acceptedPrivacyPolicy"
                        type="checkbox"
                        className="mr-2"
                        checked={userData.acceptedPrivacyPolicy}
                        onChange={handleChange('acceptedPrivacyPolicy')}
                    />
                    <label htmlFor="acceptedPrivacyPolicy" className="text-gray-700">
                        I accept the <Link href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>
                    </label>
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-300 ${
                        userData.acceptedTerms && userData.acceptedPrivacyPolicy ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!userData.acceptedTerms || !userData.acceptedPrivacyPolicy}
                    title={!userData.acceptedTerms || !userData.acceptedPrivacyPolicy ? "You must accept the terms and privacy policy to register." : "Click to register"}
                >
                    {userData.isGardener ? "Next" : "Register"}
                </button>
            </form>
        </div>
    );
}
