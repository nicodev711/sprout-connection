import { useState } from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import StripeDetailsForm from './StripeDetailsForm';

const steps = ['1', '2'];

export default function RegistrationForm() {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        isGardener: false,
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        city: '',
        postalCode: '',
        state: '',
        country: 'GB',
        phone: '',
        acceptedTerms: '',
        acceptedPrivacyPolicy: ''
    });

    const handleChange = (input) => (e) => {
        const { value, checked } = e.target;
        setUserData({ ...userData, [input]: e.target.type === 'checkbox' ? checked : value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Handle successful registration
                const data = await response.json();
                if (data.url) {
                    if (data.url.startsWith('https://')) {
                        window.location.href = data.url; // Redirect to Stripe onboarding
                    } else {
                        alert('The URL provided is not secure (HTTPS).');
                    }
                }
            } else {
                const errorData = await response.json();
                alert(`Failed to register: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    const renderFormStep = () => {
        switch (step) {
            case 0:
                return <BasicDetailsForm handleChange={handleChange} userData={userData} nextStep={nextStep} />;
            case 1:
                return userData.isGardener ? <StripeDetailsForm handleChange={handleChange} userData={userData} prevStep={prevStep} handleSubmit={handleSubmit} /> : handleSubmit();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Register</h1>
                {renderFormStep()}
            </div>
        </div>
    );
}
