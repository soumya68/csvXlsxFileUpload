module.exports = (app) => {
    var orderModule = require('../module/order_module')();
    //START OF API FOR CREATE ORDER DETAILS 
    //Response: status, message
    app.post('/api/placeorderBackup', function (req, res) {
        try {
            if (!req.body.productDetails) {
                res.status(400).json({ status: false, message: "productDetails parameter is missing" });
                return;
            }
            if (!req.body.finalPrice) {
                res.status(400).json({ status: false, message: "finalPrice parameter is missing" });
                return;
            }
            if (!req.body.residentId) {
                res.status(400).json({ status: false, message: "residentId parameter is missing" });
                return;
            }
            if (!req.body.redeemedPoints) {
                res.status(400).json({ status: false, message: "redeemedPoints parameter is missing" });
                return;
            }
            if (!req.body.countryCode) {
                res.status(400).json({ status: false, message: "countryCode parameter is missing" });
                return;
            }
            if (!req.body.pointSource) {
                res.status(400).json({ status: false, message: "pointSource parameter is missing" });
                return;
            }
            const { productDetails, finalPrice, residentId, redeemedPoints, pointSource, countryCode } = req.body
            orderModule.createOrder(productDetails,
                finalPrice,
                residentId,
                redeemedPoints,
                pointSource, countryCode,
                function (error, result, message) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            message: message,
                            orderId: null,
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            orderId: result._id,
                        })
                    }
                })
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR CREATE ORDER DETAILS 
    //START OF API FOR PROCESS ORDER DETAILS 
    //Response: status, message,discountAmount,finalPrice,totalEarnedPoints
    //functions:createPointsDetails
    //Params:orderId,redeemedPoints,countryCode,pointSource
    app.post('/api/processorder', function (req, res) {
        try {
            if (!req.body.orderId) {
                res.status(400).json({ status: false, message: "orderId parameter is missing" });
                return;
            }
            if (!req.body.redeemedPoints) {
                res.status(400).json({ status: false, message: "redeemedPoints parameter is missing" });
                return;
            }
            if (!req.body.countryCode) {
                res.status(400).json({ status: false, message: "countryCode parameter is missing" });
                return;
            }
            if (!req.body.pointSource) {
                res.status(400).json({ status: false, message: "pointSource parameter is missing" });
                return;
            }
            const { redeemedPoints, pointSource, countryCode, orderId } = req.body
            // ON ORDER PROCESS NEED TO CREATE POINTS DETAILS
            orderModule.createPointsDetails(orderId,
                redeemedPoints,
                pointSource, countryCode,
                function (error, message, discountAmount, finalPrice, totalEarnedPoints) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            message: message,
                            discountAmount: parseFloat(discountAmount).toFixed(2),
                            finalPrice: parseFloat(finalPrice).toFixed(2),
                            totalEarnedPoints: totalEarnedPoints
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            discountAmount: parseFloat(discountAmount).toFixed(2),
                            finalPrice: parseFloat(finalPrice).toFixed(2),
                            totalEarnedPoints: totalEarnedPoints
                        })
                    }
                })
        }
        catch (er) {
            console.log(er)
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR PROCESS ORDER DETAILS 
    //Start To get the points earned after successfully deliver
    app.get('/api/pointsupdate', function (req, res) {
        try {
            if (!req.body.orderId) {
                res.json({ status: false, message: "orderId parameter is missing" });
                return;
            }
            orderModule.pointsupdate(req.body.orderId,
                function (error, result, message) {
                    if (error) {
                        res.status(200).json({
                            status: false,
                            message: message,
                            data: result,
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            data: result,
                        })
                    }
                })
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    })
    //Eng To get the points earned
};
// -----------------------------
// input param should be
// orderId, pointsRedeemed,userid
// 1)API input params orderID, PointsRedeemed
// and user Id
// 2) you need get order object from order id
// 3) create record in userpoints object for a orderid
// with orderid , pointsRedeemed
// 4) update available points as points are redeemed
//    availablepoints = available points - redeemed points
// 5) update available points in user collection
// --------------------
// 6)  now based on order id calculate earn points
// 7) get orderobject --- iterate it-- and check each item whether points earned is true or not
// 8)if True then whatever the price of that item purchased in order --- add into one price say AmountForPointsCalculation
// 9)now we have total AmountForPointsCalculation, from configuration file check
// and calculate points
// 10) pointsEarnedCalculation -- 1
// 12) isPointsAddedToResdient-0