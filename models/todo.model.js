const mongoose = require("mongoose");
const { Schema } = mongoose;

// Todo Schema for mongoose
let TodoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Tied the author of the todo by the author's ObjectId
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", TodoSchema);
