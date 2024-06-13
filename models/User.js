import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isGardener: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    stripeAccountId: {
        type: String,
    },
    withdrawableAmount: {
        type: Number,
        default: 0,
    },
    totalEarnings: {
        type: Number,
        default: 0,
    },
    acceptedTerms: {
        type: Boolean,
        required: true,
        default: false
    },
    acceptedPrivacyPolicy: {
        type: Boolean,
        required: true,
        default: false
    },
    postcode: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    termsAcceptedDate: {
        type: Date,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
