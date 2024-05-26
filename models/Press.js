import mongoose from 'mongoose';

const PressReleaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const PressRelease = mongoose.models.PressRelease || mongoose.model('PressRelease', PressReleaseSchema);

export default PressRelease;
