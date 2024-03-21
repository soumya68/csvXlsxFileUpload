const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    let env = process.env.NODE_ENV || "development";
    var url = null;

    if (env === "development" || env === "test") {
      url = process.env.DEV_URL;
    } else {
      url = process.env.PROD_URL;
    }

    await mongoose.connect(url);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
