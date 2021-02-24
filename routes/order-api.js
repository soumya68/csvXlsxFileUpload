
module.exports = (app) => {
    var orderModule = require('../module/order-module')();
    const order = require('../models/order-schema');
    //START OF API FOR CREATE ORDER DETAILS 
    //Response: status, message
    app.post('/api/place_order', function (req, res) {
        try {
            
            if (!req.body.productDetails) {
                res.json({ status: false, message: "productDetails parameter is missing" });
                return;
            }

            if (!req.body.finalPrice) {
                res.json({ status: false, message: "final_price parameter is missing" });
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

            if (!req.body.earnedPoints) {
                res.json({ status: false, message: "userId parameter is missing" });
                return;
            }
            if (!req.body.earnedPointsExpiryDate) {
                res.json({ status: false, message: "redeemedPoints parameter is missing" });
                return;
            }
            if (!req.body.pointSource) {
                res.json({ status: false, message: "pointSource parameter is missing" });
                return;
            }
           

            orderModule.createOrder(req.body.userId,
                function (error, result,message) {
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
    });
    //END OF API FOR CREATE ORDER DETAILS 
};