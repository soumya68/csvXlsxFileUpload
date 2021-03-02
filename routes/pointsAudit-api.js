module.exports = (app) => {
    var pointsModule = require('../module/pointsAudit_module')();
    const pointsAudit = require('../models/pointsAudit-schema');
    //START OF API FOR USER POINTS DETAILS 
    //Response: status, message
    app.post('/api/user/points', function (req, res) {
        try {
            if (!req.body.residentId) {
                res.status(400).json({ status: false, message: "residentId parameter is missing" });
                return;
            }
            pointsModule.userPoints(req.body.residentId,
                function (error, result, message) {
                    if (error) {
                        res.status(500).json({
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
    //END OF API FOR USER POINTS DETAILS 
    // Start of API for point datails 
    app.get('/api/user/transactiondetails', function (req, res) {
        try {
            if (!req.body.residentId) {
                res.status(400).json({ status: false, message: "residentId parameter is missing" });
                return;
            }
            pointsModule.transactionDetails(req.body.residentId,
                function (error, result, message) {
                    if (error) {
                        res.status(500).json({
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
    // end of API for point details
    // Start of API for Redeemption 
    app.get('/api/redeemdetails', function (req, res) {
        try {
            if (!req.body.residentId) {
                res.status(400).json({ status: false, message: "residentId parameter is missing" });
                return;
            }
            if (!req.body.redeemedPoints) {
                res.status(400).json({ status: false, message: "redeemedPoints parameter is missing" });
                return;
            }
            pointsModule.userRedeemPoints(req.body.residentId, req.body.redeemedPoints,
                function (error, result, message) {
                    if (error) {
                        res.status(500).json({
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
    //End of API for Redeemption
    // Start of API for Point Expiry
    app.post('/api/pointconversion', function (req, res) {
        try {
            if (!req.body.countryCode) {
                res.status(400).json({ status: false, message: "countryCode parameter is missing" });
                return;
            }
            if (!req.body.redeemPoints) {
                res.status(400).json({ status: false, message: "redeemPoints parameter is missing" });
                return;
            }
            const { countryCode, redeemPoints } = req.body
            pointsModule.pointConversion(countryCode, redeemPoints,
                function (error, currencyValue, currency) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            currencyValue: null,
                            currency: null
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            currencyValue: currencyValue,
                            currency: currency
                        })
                    }
                })
        }
        catch (er) {
            res.status(500).json({ status: false, message: er });
        }
    });
    //End of API for Point Expiry
    // Start of API for Point Expiry
    app.post('/api/', function (req, res) {
        try {
            // if (!req.body.userId) {
            //     res.status(400).json({ status: false, message: "userId parameter is missing" });
            //     return;
            // }
            // if (!req.body.redeemedPoints) {
            //     res.status(400).json({ status: false, message: "redeemedPoints parameter is missing" });
            //     return;
            // }
            setInterval(function () {
                pointsModule.deactivatePoints(
                    function (error, message) {
                        if (error) {
                            res.status(500).json({
                                status: false,
                                message: message,
                            })
                        }
                        else {
                            res.status(200).json({
                                status: true,
                                message: message,
                            })
                        }
                    })
            }, 3000);
        }
        catch (er) {
            res.status(500).json({ status: false, message: er });
        }
    });
    //End of API for Point Expiry
};