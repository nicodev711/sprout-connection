// components/StripeDetailsForm.js
export default function StripeDetailsForm({ prevStep, handleChange, userData, nextStep }) {
    return (
        <div>
            <h2>Stripe Account Details</h2>
            <input type="text" placeholder="First Name" onChange={handleChange('firstName')} value={userData.firstName} required />
            <input type="text" placeholder="Last Name" onChange={handleChange('lastName')} value={userData.lastName} required />
            <input type="date" placeholder="Date of Birth" onChange={handleChange('dob')} value={userData.dob} required />
            <input type="text" placeholder="Address" onChange={handleChange('address')} value={userData.address} required />
            <input type="text" placeholder="City" onChange={handleChange('city')} value={userData.city} required />
            <input type="text" placeholder="Postal Code" onChange={handleChange('postalCode')} value={userData.postalCode} required />
            <input type="text" placeholder="State" onChange={handleChange('state')} value={userData.state} required />
            <input type="text" placeholder="Country" onChange={handleChange('country')} value={userData.country} required />
            <input type="text" placeholder="Phone" onChange={handleChange('phone')} value={userData.phone} required />
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
        </div>
    );
}
