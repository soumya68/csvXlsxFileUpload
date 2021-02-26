module.exports = (app) => {
    var pointsModule = require('../module/pointsAudit_module')();
    const pointsAudit = require('../models/pointsAudit-schema');
    //START OF API FOR USER POINTS DETAILS 
    //Response: status, message
    app.post('/api/user/points', function (req, res) {
        try {
            if (!req.body.userId) {
                res.json({ status: false, message: "userId parameter is missing" });
                return;
            }
            pointsModule.userPoints(req.body.userId,
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
    });
    //END OF API FOR USER POINTS DETAILS 
      // Start of API for point datails 
      app.get('/api/user/pointdetails', function (req, res) {
        try {
            console.log("userid",req.body.userId)
            if (!req.body.userId) {
                res.json({ status: false, message: "userId parameter is missing" });
                return;
            }
            pointsModule.userPoints(req.body.userId,
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
    // end of API for point details
    // Start of API for Redeemption 
    app.get('/api/redeemdetails',function(req, res){
        try{
        console.log(req.body.availablePoints)
        if (!req.body.userId) {
            res.json({ status: false, message: "userId parameter is missing" });
            return;
        }
        pointsModule.userRedeemPoints(req.body.userId,
           
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
    //End of API for Redeemption
};