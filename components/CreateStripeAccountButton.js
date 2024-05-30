import { useState } from 'react';
import axios from 'axios';

const CreateStripeAccountButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateStripeAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/create-stripe-account');
            alert('Stripe account created successfully');
        } catch (error) {
            console.error('Failed to create Stripe account:', error);
            setError('Failed to create Stripe account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleCreateStripeAccount} disabled={loading}>
                {loading ? 'Creating Stripe Account...' : 'Create Stripe Account'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CreateStripeAccountButton;
