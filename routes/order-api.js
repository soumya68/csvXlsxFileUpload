module.exports = (app) => {
    var orderModule = require('../module/order_module')();
    const order = require('../models/order-schema');
    var pointDetails = require('../utils/pointsDetails.json');
    //START OF API FOR CREATE ORDER DETAILS 
    //Response: status, message
    app.post('/api/placeorder', function (req, res) {
        try {
            if (!req.body.productDetails) {
                res.json({ status: false, message: "productDetails parameter is missing" });
                return;
            }
            if (!req.body.finalPrice) {
                res.json({ status: false, message: "finalPrice parameter is missing" });
                return;
            }
            if (!req.body.userId) {
                res.json({ status: false, message: "userId parameter is missing" });
                return;
            }
            if (!req.body.redeemedPoints) {
                res.json({ status: false, message: "redeemedPoints parameter is missing" });
                return;
            }
            if (!req.body.countryCode) {
                res.json({ status: false, message: "countryCode parameter is missing" });
                return;
            }
            // if (!req.body.availablePoints) {
            //     res.json({ status: false, message: "availablePoints parameter is missing" });
            //     return;
            // }
            if (!req.body.pointSource) {
                res.json({ status: false, message: "pointSource parameter is missing" });
                return;
            }
            orderModule.createOrder(req.body.productDetails,
                req.body.finalPrice,
                req.body.userId,
                req.body.redeemedPoints,
                req.body.pointSource, req.body.countryCode,
                function (error, result, message) {
                    if (error) {
                        res.status(200).json({
                            status: false,
                            message: message,
                            orderId: null,
                            availablePoints:result.availablePoints
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            orderId: result._id,
                            availablePoints:result.availablePoints
                        })
                    }
                })
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR CREATE ORDER DETAILS 
};