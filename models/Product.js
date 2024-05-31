import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quantity: {
        type: Number,
    },
    units: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Vegetables', 'Fruits', 'Honey', 'Plants', 'Seeds'],
        required: true,
    },
    isListed: {
        type: Boolean,
        default: true,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
    imageCDNLink: {
        type: String,
    },
});

ProductSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    next();
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
