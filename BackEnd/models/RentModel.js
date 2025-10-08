const mongoose = require('mongoose')

const { Schema } = mongoose

const RentPaymentSchema = new Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'tenants', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'razorpay', 'none'], default: 'none' },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
    razorpayPaymentId: { type: String, default: null },
}, {
    timestamps: true
});





module.exports = mongoose.model('rents', RentPaymentSchema)