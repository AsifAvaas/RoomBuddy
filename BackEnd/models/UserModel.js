const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },
    dob: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isApprovedAdmin: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('users', UserSchema)