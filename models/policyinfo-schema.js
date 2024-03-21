var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var policyInfoSchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
    },
    policyStartDate: {
      type: Date,
      required: true,
    },
    policyEndDate: {
      type: Date,
      required: true,
    },
    policyCatagory: {
      type: Schema.Types.ObjectId,
      ref: "lobs",
      required: true,
    },
    companyCollectionId: {
      type: Schema.Types.ObjectId,
      ref: "carriers",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
module.exports = mongoose.model("policyinfo", policyInfoSchema);
