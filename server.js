const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const connectDB = require('./database/mongoose');
const configDetails = require('./config/config.json')
const PORT = configDetails.development.PORT
var cron = require('node-cron');
var cors = require('cors')
var cronJob = require('./cronjob/cron-job')
var DIR = process.env.SUCCESSDIR
const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type',],
};
app.use(cors(corsOpts));
//const PORT = 8000
/*middlewares*/
app.use(bodyParser.json({
  limit: '150mb',
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//mongodb connection using mongoose
connectDB(function (err) {
  if (err) {
    console.log("err")
  }
  else {
    // TO RUN CRON JOB ONLY AFTER DATABASE CONNECTION DONE
    cronJob.startCrons()
    console.log("Database connection success")
  }
})
app.get('/', (req, res) => {
  res.send('Welcome to Unicef API!')
})
/*Incudes all API routes*/
require('./routes/index')(app, connectDB);
/*Listen express server on port*/
app.listen(process.env.PORT || PORT, () => {
  console.info(`Server is running on port.... ${process.env.PORT || PORT}`);
});
//"mongodb+srv://soumya:12345@cluster0.iocs1.mongodb.net/Unicef"