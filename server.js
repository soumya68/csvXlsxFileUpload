const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./database/mongoose');
const configDetails = require('./config/config.json')
const PORT = configDetails.development.PORT
var cron = require('node-cron');
const order = require('./models/order-schema');
const residents = require('./models/resident-schema');
const pointsAudit = require('./models/pointsAudit-schema');
var pointsModule = require('./module/pointsAudit_module')();
var medicationModule = require('./module/medication_module')();
var cors = require('cors')

var DIR = 'Catalouge_Import/'
console.log('aaaaaa', DIR)
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
connectDB()
app.get('/', (req, res) => {
  res.send('Welcome to Unicef API!')
})
/*Incudes all API routes*/
require('./routes/index')(app, connectDB);
// Start the cron job ----will run every day midnight
cron.schedule("00 00 00 * * *", function () {
  // cron.schedule("*/10 * * * * *", function() { 
  updateOrderStatus(function (err, res) {
    if (err) {
    }
    else {
    }
  })
});
async function updateOrderStatus(callbackfn) {
  try {
    let result = await order.find({ isPointsAddedToResident: false })
    Promise.all(
      result.map(async ele => {
        // Update order status and points in the collections
        let orderdata = await order.findOneAndUpdate({ _id: ele._id },
          { $set: { isDelivered: true, isPointsAddedToResident: true } },
          { new: true })
        let auditdata = await pointsAudit.findOneAndUpdate({ orderId: ele._id },
          { $set: { isActive: false, earnedPointsExpiryDate: new Date() } },
          { new: true })
        let points = auditdata.earnedPoints
        let residentdata = await residents.findOneAndUpdate({ _id: ele._id },
          { $set: { isPointsAddedToResident: true, earnedPoints: points } },
          { new: true })
        let finalData = { ...orderdata, ...auditdata, ...residentdata }
        return finalData
      })
    ).then(function (documents) {
    });
    callbackfn(null, finalData);
  } catch (err) {
    callbackfn(err, null,);
  }
}
// End the cron job ----
// Start of cron job for earnedpoint details
/* cron.schedule("00 00 00 * * *", function() { 
  updatePointsCalculated(function (err, res) {
    if (err) {
      console.log("err")
    }
    else {
      console.log("success")
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
// START OF  CRON JOB FOR RESIDENTS POINT EXPIRY PROCESS
// cron.schedule('59 23 * * *', () => {
//   
//   pointsModule.deactivatePoints(
//     function (error, message) {
//       if (error) {
//       }
//       else {
//       }
//       console.log('running a task at 11:59 PM every day');
//     })
// });
// END OF  CRON JOB FOR RESIDENTS POINT EXPIRY PROCESS

// START OF  CRON JOB FOR CATALOUGE FILE UPLOAD PROCESS
// cron.schedule('0,30 * * * *', () => {
//   console.log('DIR', DIR)
//   medicationModule.processFile(DIR,
//     function (error, message) {
//       if (error) {
//         console.log('err')
//       }
//       else {
//         console.log('success')
//       }
//       console.log('running a task at every 30 mins on every day');
//     })
// });
// END OF  CRON JOB FOR CATALOUGE FILE UPLOAD PROCESS


/*Listen express server on port*/
app.listen(process.env.PORT || PORT, () => {
  console.info(`Server is running on port.... ${process.env.PORT || PORT}`);
});

//"mongodb+srv://soumya:12345@cluster0.iocs1.mongodb.net/Unicef"