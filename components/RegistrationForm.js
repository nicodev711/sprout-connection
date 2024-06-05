// components/RegistrationForm.js
import { useState } from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import StripeDetailsForm from './StripeDetailsForm';
import BankDetailsForm from './BankDetailsForm';

const steps = ['Basic Details', 'Stripe Details', 'Bank Details'];

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
        country: '',
        phone: '',
        bankAccountHolderName: '',
        bankAccountNumber: '',
        sortCode: '',
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
                    window.location.href = data.url; // Redirect to Stripe onboarding
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
                return userData.isGardener ? <StripeDetailsForm handleChange={handleChange} userData={userData} prevStep={prevStep} nextStep={nextStep} /> : handleSubmit();
            case 2:
                return userData.isGardener ? <BankDetailsForm handleChange={handleChange} userData={userData} prevStep={prevStep} handleSubmit={handleSubmit} /> : null;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>{steps[step]},.</h1>
            {renderFormStep()}
        </div>
    );
}
