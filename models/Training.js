const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Training = mongoose.model(
  "Training",
  new Schema(
    {
      trainingTag: {
        type: String,
        required: true,
      },
      revision: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: String,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Training;
