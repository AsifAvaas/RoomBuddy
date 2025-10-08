const mongoose = require('mongoose')

const { Schema } = mongoose

const RoomSchema = new Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    floor: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    occupancy_type: {
        type: String,
        required: true,
        enum: ['Single', 'Triple', 'Shared']
    },
    available_slots: {
        type: Number,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('rooms', RoomSchema)