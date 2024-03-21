var mongoose = require("mongoose");
var policyCatagorySchema = new mongoose.Schema(
  {
    catagoryName: {
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

module.exports = mongoose.model("lob", policyCatagorySchema);
