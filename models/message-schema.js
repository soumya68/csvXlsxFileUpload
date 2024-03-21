var mongoose = require("mongoose");
var messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("message", messageSchema);
