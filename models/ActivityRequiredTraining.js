const mongoose = require("../db/conn");
const { Schema } = mongoose;

const ActivityRequiredTraining = mongoose.model(
  "ActivityRequiredTraining",
  new Schema(
    {
      activity: {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        required: true,
      },
      training: {
        type: Schema.Types.ObjectId,
        ref: "Training",
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = ActivityRequiredTraining;
