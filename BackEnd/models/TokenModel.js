const mongoose = require('mongoose')

const { Schema } = mongoose

const TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
})

module.exports = mongoose.model('tokens', TokenSchema)