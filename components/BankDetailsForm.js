// components/BankDetailsForm.js
export default function BankDetailsForm({ prevStep, handleChange, userData, handleSubmit }) {
    return (
        <div>
            <h2>Bank Details</h2>
            <input type="text" placeholder="Account Holder Name" onChange={handleChange('bankAccountHolderName')} value={userData.bankAccountHolderName} required />
            <input type="text" placeholder="Account Number" onChange={handleChange('bankAccountNumber')} value={userData.bankAccountNumber} required />
            <input type="text" placeholder="Routing Number" onChange={handleChange('routingNumber')} value={userData.routingNumber} required />
            <button onClick={prevStep}>Back</button>
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
    );
}
