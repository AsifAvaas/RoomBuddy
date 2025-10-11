const mongoose = require('mongoose')

const { Schema } = mongoose

const TenantSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    bedNo: {
        type: Number,
        required: true
    },
    move_in_date: {
        type: Date,
        required: true
    },
    isActive: { type: Boolean, default: true },
    next_due_date: { type: Date },
}, {
    timestamps: true
})

module.exports = mongoose.model('tenants', TenantSchema)