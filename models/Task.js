const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Task = mongoose.model(
  "Task",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      dueDate: {
        type: Date,
        required: true,
      },
      technician: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
      activities: [
        {
          type: Schema.Types.ObjectId,
          ref: "Activity",
        },
      ],
      employees: [
        {
          type: Schema.Types.ObjectId,
          ref: "Employee",
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = Task;
