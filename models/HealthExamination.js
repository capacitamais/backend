const mongoose = require("../db/conn");
const { Schema } = mongoose;

const HealthExamination = mongoose.model(
  "HealthExamination",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
    },
    { timestamps: true }
  )
);

module.exports = HealthExamination;
