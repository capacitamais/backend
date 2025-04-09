const mongoose = require("../db/conn");
const { Schema } = mongoose;

const TrainingReceived = mongoose.model(
  "TrainingReceived",
  new Schema(
    {
      employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      training: {
        type: Schema.Types.ObjectId,
        ref: "Training",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      dueDate: {
        type: String, // "N/A" se não tiver vencimento
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = TrainingReceived;
