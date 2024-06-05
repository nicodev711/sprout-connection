// components/BasicDetailsForm.js
export default function BasicDetailsForm({ handleChange, userData, nextStep }) {
    return (
        <div>
            <h2>Basic Detailss</h2>
            <input type="text" placeholder="Username" onChange={handleChange('username')} value={userData.username} required />
            <input type="email" placeholder="Email" onChange={handleChange('email')} value={userData.email} required />
            <input type="password" placeholder="Password" onChange={handleChange('password')} value={userData.password} required />
            <input type="checkbox" id="isGardener" checked={userData.isGardener} onChange={handleChange('isGardener')} />
            <label htmlFor="isGardener">Register as Gardener</label>
            <button onClick={nextStep}>Next</button>
        </div>
    );
}
