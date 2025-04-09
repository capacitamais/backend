const mongoose = require('../db/conn')
const { Schema } = mongoose

const Employee = mongoose.model(
    'Employee',
    new Schema(
        {
            name: {
                type: String,
                required: true,
            },
            registration: {
                type: String,
                required: true,
                unique: true,
            }
        },
        { timestamps: true },
    ),
)

module.exports = Employee