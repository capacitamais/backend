const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema(
        {
            name: {
                type: String,
                required: true,
            },
            registration: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
        },
        { timestamps: true },
    ),
)

module.exports = User