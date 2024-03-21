var mongoose = require("mongoose");
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    dob: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      default: null,
    },
    userType: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
userSchema.index({ firstName: 1 });

module.exports = mongoose.model("user", userSchema);
