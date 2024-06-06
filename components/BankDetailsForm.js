// components/BankDetailsForm.js
import { useState } from 'react';

export default function BankDetailsForm({ prevStep, handleChange, userData, handleSubmit }) {
    const [submitting, setSubmitting] = useState(false);

    const handleFormSubmit = async () => {
        setSubmitting(true);
        await handleSubmit();
        setSubmitting(false);
    };

    return (
        <div>
            <div className={"flex justify-center"}>
                <ul className="steps steps-vertical lg:steps-horizontal">
                    <li className="step step-primary"></li>
                    <li className="step step-primary"></li>
                    <li className="step step-primary"></li>
                    <li className="step"></li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Bank Details</h1>
            <div className={"mb-4"}>
                <input className="input input-bordered w-full" type="text" placeholder="Account Holder Name"
                       onChange={handleChange('bankAccountHolderName')}
                       value={userData.bankAccountHolderName} required/>
            </div>
            <div className={"mb-4"}>
                <input className="input input-bordered w-full" type="text" placeholder="Account Number"
                       onChange={handleChange('bankAccountNumber')}
                       value={userData.bankAccountNumber} required/>
            </div>
            <div className={"mb-4"}>
                <input className="input input-bordered w-full" type="text" placeholder="Sort Code"
                       onChange={handleChange('routingNumber')}
                       value={userData.routingNumber} required/>
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
