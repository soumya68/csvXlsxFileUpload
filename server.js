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
var orderModule = require('./module/order_module')();
var cors = require('cors')

var DIR = 'Catalouge_Import/'
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
// Start the cron job for update order status ----will run every day midnight
cron.schedule("00 00 00 * * *", function () {
   //cron.schedule("*/10 * * * * *", function() { 
     orderModule.updateOrderStatus(function(err,res){
       if(err){
       }
       else{
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
}); */
//End of cron job for update points calculated status
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