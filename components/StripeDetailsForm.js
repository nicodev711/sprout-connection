import { useState } from "react";

export default function StripeDetailsForm({ prevStep, handleChange, userData, handleSubmit }) {
    const [phoneError, setPhoneError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!userData.firstName) errors.firstName = 'First Name is required';
        if (!userData.lastName) errors.lastName = 'Last Name is required';
        if (!userData.dob) errors.dob = 'Date of Birth is required';
        if (!userData.address) errors.address = 'Address is required';
        if (!userData.city) errors.city = 'City is required';
        if (!userData.postalCode) errors.postalCode = 'Postal Code is required';
        if (!userData.phone) errors.phone = 'Phone number is required';
        return errors;
    };

    const handleFormSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setSubmitting(true);
        await handleSubmit();
        setTimeout(() => { setSubmitting(false); }, 3000);
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        if (value.startsWith('0')) {
            setPhoneError('Phone number should not start with 0');
        } else {
            setPhoneError('');
            value = '+44' + value; // Ensure the phone number starts with +44
        }
        handleChange('phone')({ target: { value } });
    };

    return (
        <div>
            <div className={"flex justify-center"}>
                <ul className="steps steps-vertical lg:steps-horizontal">
                    <li className="step step-primary"></li>
                    <li className="step step-primary"></li>
                    <li className="step"></li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Stripe Account Details</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange('firstName')}
                    value={userData.firstName}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.firstName && <p className="text-red-500 text-sm mt-2">{formErrors.firstName}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={handleChange('lastName')}
                    value={userData.lastName}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.lastName && <p className="text-red-500 text-sm mt-2">{formErrors.lastName}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="date"
                    placeholder="Date of Birth"
                    onChange={handleChange('dob')}
                    value={userData.dob}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.dob && <p className="text-red-500 text-sm mt-2">{formErrors.dob}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Address"
                    onChange={handleChange('address')}
                    value={userData.address}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.address && <p className="text-red-500 text-sm mt-2">{formErrors.address}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="City"
                    onChange={handleChange('city')}
                    value={userData.city}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.city && <p className="text-red-500 text-sm mt-2">{formErrors.city}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Postal Code"
                    onChange={handleChange('postalCode')}
                    value={userData.postalCode}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.postalCode && <p className="text-red-500 text-sm mt-2">{formErrors.postalCode}</p>}
            </div>
            <div className="mb-4 hidden">
                <input
                    type="text"
                    placeholder="State"
                    onChange={handleChange('state')}
                    value={userData.state}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.state && <p className="text-red-500 text-sm mt-2">{formErrors.state}</p>}
            </div>
            <div className="mb-4 hidden">
                <input
                    type="text"
                    placeholder="Country"
                    onChange={handleChange('country')}
                    value={userData.country}
                    required
                    className="input input-bordered w-full"
                />
                {formErrors.country && <p className="text-red-500 text-sm mt-2">{formErrors.country}</p>}
            </div>
            <div className="mb-4">
                <div className="flex items-center">
                    <span className="input input-bordered border-r-0 rounded-r-none flex items-center justify-center">+44</span>
                    <input
                        type="text"
                        placeholder="Phone"
                        onChange={handlePhoneChange}
                        value={userData.phone.replace('+44', '')}
                        required
                        className="input input-bordered rounded-l-none w-full"
                    />
                </div>
                {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
                {formErrors.phone && <p className="text-red-500 text-sm mt-2">{formErrors.phone}</p>}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="btn btn-secondary"
                >
                    Back
                </button>
                <button
                    onClick={handleFormSubmit}
                    className="btn btn-primary"
                    disabled={submitting} // Disable the button while submitting
                >
                    {submitting ? (
                        <span className="loading loading-spinner loading-md"></span> // Show loading spinner
                    ) : (
                        "Submit"
                    )}
                </button>
            </div>
        </div>
    );
}
