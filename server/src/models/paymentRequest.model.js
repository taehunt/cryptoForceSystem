import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentRequestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    merchant: String,
    txHash: String,
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    approvedAt: Date
});

export default mongoose.model('PaymentRequest', paymentRequestSchema);
