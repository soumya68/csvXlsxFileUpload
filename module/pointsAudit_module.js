
const pointsAudit = require('../models/pointsAudit-schema');
module.exports = function () {
    var pointsAuditModule = {


        // Start of get user points details
        userPoints: function (userId, callBack) {
            try {
                totalLapsedPoints = 0
                totalEarnedPoints = 0
                totalRedeemedPoints = 0
                totalAvailablePoints = 0
                pointsAudit.find({ userId: userId }, function (err, docs) {
                    if (err) {
                        console.log(err);
                        callBack(true, null,"Error");
                    }
                    else {


                        if (docs.length > 0) {
                            var index = 0;
                            var checkData = function (doc) {

                                // Total Earned points = sum of toal earned points of perticular user id of points collection
                                // Total Redeemed points = sum of total redeemed points of perticular user id of points collection
                                // Total Available points = Total Earned points(whose is_active is true) -Total Redeemed points
                                // Total Lapsed points = Sum of total earned points whose is_active is false

                                totalEarnedPoints = parseInt(totalEarnedPoints) + parseInt(doc.earnedPoints)
                                totalRedeemedPoints = parseInt(totalRedeemedPoints) + parseInt(doc.redeemedPoints)
                                if (doc.isActive) {
                                    totalAvailablePoints = totalEarnedPoints - totalRedeemedPoints
                                }
                                if (!doc.isActive) {
                                    totalLapsedPoints = totalEarnedPoints + totalLapsedPoints
                                }


                                index++;
                                if (index < docs.length) {

                                    checkData(docs[index]);
                                } else {

                                    var data = {
                                        totalLapsedPoints: totalLapsedPoints,
                                        totalAvailablePoints: totalAvailablePoints,
                                        totalEarnedPoints: totalEarnedPoints,
                                        totalRedeemedPoints: totalRedeemedPoints
                                    }
                                    callBack(false, data,"User points details available");
                                }

                            }

                            if (docs.length !== 0) {
                                checkData(docs[index]);
                            }

                        }
                        else {
                            callBack(false, null,"User has no point");
                        }


                    }

                });


            } catch (e) {
                console.log(e)
                callBack(true, null);
            }
        },
        // End of get user points details
    }
    return pointsAuditModule;

}
