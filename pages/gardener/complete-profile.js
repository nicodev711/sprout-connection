// pages/gardener/complete-profile.js
import { useState } from 'react';
import axios from 'axios';

export default function CompleteProfile({ user }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '', // Format: YYYY-MM-DD
        address: '',
        city: '',
        postalCode: '',
        country: 'GB', // Default to GB for United Kingdom
        businessType: 'individual', // Default business type
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/stripe/update-account', formData);
            alert('Profile completed successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
                <label>Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div>
                <label>Date of Birth (YYYY-MM-DD)</label>
                <input name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            <div>
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>City</label>
                <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
                <label>Postal Code</label>
                <input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            </div>
            <div className={"hidden"}>
                <label>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} required />
            </div>
            <button type="submit">Complete Profile</button>
        </form>
    );
}
