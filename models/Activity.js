const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Activity = mongoose.model(
  "Activity",
  new Schema(
    {
      name: {
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

module.exports = Activity;
