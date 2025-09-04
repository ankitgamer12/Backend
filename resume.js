const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    section: [
      {
        heading: String,
        content: String,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resume", resumeSchema);
