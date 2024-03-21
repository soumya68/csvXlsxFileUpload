var mongoose = require("mongoose");
var carrierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("carrier", carrierSchema);
