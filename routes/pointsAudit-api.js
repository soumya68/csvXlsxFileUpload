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
};