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
                        callBack(true, null, "Error");
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
                                    totalLapsedPoints = parseInt(totalLapsedPoints) + parseInt(doc.earnedPoints)
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
                                    callBack(false, data, "User points details available");
                                }
                            }
                            if (docs.length !== 0) {
                                checkData(docs[index]);
                            }
                        }
                        else {
                            callBack(false, null, "User has no point");
                        }
                    }
                });
            } catch (e) {
                callBack(true, null);
            }
        },
        // End of get user points details
        // Start of  create user point details
        createPointDetails: function (productDetails, finalPrice,
            userId,
            redeemedPoints,
            pointSource, countryCode, callBack) {
            try {
                earnedPoints = 0;
                totalPrice = 0;
                if (
                    finalPrice >= pointDetails[countryCode].orderTotalPrice) {
                    earnedPoints = pointDetails[countryCode].pointsAmount
                }
                if (redeemedPoints > 0) {
                    var discountAmount = (pointDetails[countryCode].conversionAmount * redeemedPoints) / pointDetails[countryCode].points
                    totalPrice = finalPrice - discountAmount
                }
                var orderData = {
                    userId: userId,
                    productDetails: JSON.parse(productDetails),
                    finalPrice: totalPrice,
                    isDelivered: false,
                    date: new Date()
                }
                const orderDetails = new order(orderData);
                orderDetails.save().then(response => {
                    callBack(false, response, "Order created successfully");
                    pointsModule.ce
                })
                    .catch(err => {
                        callBack(true, err, "Error",);
                    });
            } catch (e) {
                callBack(true, null);
            }
        },
        // End of create user point  details
        //Start of get Redeem points
        userRedeemPoints: function (userId, redeemedPoints, callBack) {
            try {
                pointsAudit.find({ userId: userId }).sort({ _id: -1 }).limit(1).then((result) => {
                    console.log(result)
                    console.log(redeemedPoints)
                    if (result[0].availablePoints >= redeemedPoints) {

                        callBack(false, "User has available redeempoints");
                    }
                    else {
                        callBack(true, null, "User has no redeempoints");
                    }
                }).catch(err => {
                    console.log(err);
                });


            } catch (e) {
                console.log(e)
                callBack(true, null);
            }
        }
        //End of get Redeem points
    }
    return pointsAuditModule;
}
