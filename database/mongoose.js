const mongoose = require("mongoose");
require('dotenv').config()
console.log('process.env.NODE_ENV',process.env.NODE_ENV)

const connectDB = async (callback) => {
  try {
  //  console.log(config.get())
    var env = process.env.NODE_ENV || 'development';
    var url = null
    if (env === 'development' || env === 'test') {
      url = process.env.DEV_URL
    }
    else {
      url = process.env.PROD_URL
    }
    // console.log('url',url)
    const conn = await mongoose.connect(url, {
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
