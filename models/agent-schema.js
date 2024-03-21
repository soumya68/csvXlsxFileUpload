var mongoose = require("mongoose");
var agentSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      default: "Soumya"
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("agent", agentSchema);
