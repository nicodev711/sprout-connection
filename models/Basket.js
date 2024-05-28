// models/Basket.js
import mongoose from 'mongoose';

const BasketItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const BasketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [BasketItemSchema],
});

export default mongoose.models.Basket || mongoose.model('Basket', BasketSchema);
