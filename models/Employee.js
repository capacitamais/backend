const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Employee = mongoose.model(
  "Employee",
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
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Employee;
