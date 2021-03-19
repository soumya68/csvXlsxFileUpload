const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const connectDB = require('./database/mongoose');
const configDetails = require('./config/config.json')
const PORT = configDetails.development.PORT
var cron = require('node-cron');
const order = require('./models/order-schema');
const residents = require('./models/resident-schema');
const pointsAudit = require('./models/pointsAudit-schema');
var cors = require('cors')
var cronJob = require('./cronjob/cron-job')

var DIR = process.env.SUCCESSDIR

const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST',],
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
// Start the cron job for update order status ----will run every day midnight
cron.schedule("00 00 00 * * *", function () {
  //cron.schedule("*/10 * * * * *", function() { 
  orderModule.updateOrderStatus(function (err, res) {
    if (err) {
    }
    else {
      console.log("running a task at 12:00 AM every day")
    }
  })
});
// End the cron job for update order status 
// Start of cron job for update points calculated status
/* cron.schedule("00 00 00 * * *", function() { 
  updatePointsCalculated(function (err, res) {
     if(err){
       }
       else{
         console.log("running a task at 12:00 AM every day")
       }
  })
});
async function updatePointsCalculated(callbackfn) {
  try {
    let result = await order.find({ isEarnedPointCalculated: false })
      result.map(async ele => {
        let auditdata = await pointsAudit.findOneAndUpdate({ residentId: ele.residentId },
          { $set: { isActive: false} },
          { new: true })
          let points = auditdata.availablePoints
        let residentdata = await residents.findOneAndUpdate({ residentId: ele.residentId },
          { $set: { isPointsAddedToResident: true, availablePoints: points } },
          { new: true })
          data = {...auditdata,...residentdata}
          callbackfn(null, data);
      })
    
  } catch (err) {
    callbackfn(err, null,);
  }
} */
//End of cron job for earnedpoint details



/*Listen express server on port*/
app.listen(process.env.PORT || PORT, () => {


  console.info(`Server is running on port.... ${process.env.PORT || PORT}`);

});

//"mongodb+srv://soumya:12345@cluster0.iocs1.mongodb.net/Unicef"