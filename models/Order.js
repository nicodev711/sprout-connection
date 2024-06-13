import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gardenerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        }
    }],
    totalProductAmount: {
        type: Number,
        required: true,
    },
    serviceFee: {
        type: Number,
        required: true,
    },
    smallOrderFee: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
