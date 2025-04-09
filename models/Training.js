const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Training = mongoose.model(
  "Training",
  new Schema(
    {
      trainingTag: {
        type: String,
        required: true,
        unique: true,
      },
      description: String,
    },
    { timestamps: true }
  )
);

module.exports = Training;
