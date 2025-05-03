const mongoose = require("../db/conn");
const { Schema } = mongoose;

const EmployeeHealthExamination = mongoose.model(
  "EmployeeHealthExamination",
  new Schema(
    {
      employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      healthExamination: {
        type: Schema.Types.ObjectId,
        ref: "HealthExamination",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      isActive: {
        type: Boolean,
        required: true,
      }
    },
    { timestamps: true }
  )
);

module.exports = EmployeeHealthExamination;
