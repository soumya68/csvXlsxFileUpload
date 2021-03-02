module.exports = (app) => {
    var orderModule = require('../module/order_module')();
    const order = require('../models/order-schema');
    var pointDetails = require('../utils/pointsDetails.json');
    //START OF API FOR CREATE ORDER DETAILS 
    //Response: status, message
    app.post('/api/placeorder', function (req, res) {
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
};