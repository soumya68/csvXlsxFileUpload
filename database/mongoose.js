const mongoose = require("mongoose");
const config = require("config");

const connectDB = async (callback) => {
  try {
    const conn = await mongoose.connect(config.get("MONGODB_URI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    callback(false)
    console.info(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    callback(true)
    console.info(`Error while connecting to database',${error}`);
    process.exit(1);

  }
};

module.exports = connectDB;
