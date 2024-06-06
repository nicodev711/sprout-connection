import {useState} from "react";

export default function StripeDetailsForm({ prevStep, handleChange, userData, nextStep }) {
    const [phoneError, setPhoneError] = useState('');

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
                    <li className="step"></li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Account Details</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange('firstName')}
                    value={userData.firstName}
                    required
                    className="input input-bordered w-full"
                />
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
            </div>
            <div className="mb-4">
                <div className="flex items-center">
                    <span
                        className="input input-bordered border-r-0 rounded-r-none flex items-center justify-center">+44</span>
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
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="btn btn-secondary"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="btn btn-primary"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
