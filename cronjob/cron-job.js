
var DIR = process.env.SUCCESSDIR
var pointsModule = require('../module/pointsAudit_module')();
var medicationModule = require('../module/medication_module')();
var orderModule = require('../module/order_module')();
const cron = require("node-cron");

function startCrons() {

    var task = cron.schedule('*/5 * * * * *', () => {
        console.log("running a task every 5 seconds");
    }, {
        scheduled: false,
        timezone: 'Asia/Kolkata'
    });



    // // START OF  CRON JOB FOR RESIDENTS POINT EXPIRY PROCESS
    var pointsExpiryCron = new cron.schedule('59 23 * * *', () => {

        pointsModule.deactivatePoints(
            function (error, message) {
                if (error) {
                }
                else {
                }
                console.log('running a task at 11:59 PM every day');
            })
    },
        {
            scheduled: false,
            timeZone: 'Asia/Kolkata'
        });

    // // END OF  CRON JOB FOR RESIDENTS POINT EXPIRY PROCESS

    // // START OF  CRON JOB FOR CATALOUGE FILE UPLOAD PROCESS
    var processUploadFileCron = new cron.schedule('0,30 * * * *', () => {
        console.log('DIR', DIR)
        medicationModule.processFile(DIR,
            function (error, message) {
                if (error) {
                    console.log('err')
                }
                else {
                    console.log('success')
                }
                console.log('running a task at every 30 mins on every day');
            })
    });
    // // END OF  CRON JOB FOR CATALOUGE FILE UPLOAD PROCESS
    // Start the cron job for update order status ----will run every day midnight
    var updateOrderStatus = cron.schedule("00 00 00 * * *", function () {
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
    var updatePointsCalculated = cron.schedule("00 00 00 * * *", function () {
        orderModule.updatePointsCalculated(function (err, res) {
            if (err) {
            }
            else {
                console.log("running a task at 12:00 AM every day")
            }
        })
    });
    // End of cron job for update points calculated status


    processUploadFileCron.start()
    pointsExpiryCron.start()
    updateOrderStatus.start()
    updatePointsCalculated.start()
    //task.start();

}

module.exports = {
    startCrons
};