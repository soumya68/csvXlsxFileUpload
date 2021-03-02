const pointsAudit = require('../models/pointsAudit-schema');
var pointDetails = require('../utils/pointsDetails.json');
module.exports = function () {
    var pointsAuditModule = {
        // Start of get user points details
        userPoints: function (residentId, callBack) {
            try {
                totalLapsedPoints = 0
                totalEarnedPoints = 0
                totalRedeemedPoints = 0
                totalAvailablePoints = 0
                pointsAudit.find({ residentId: residentId }, function (err, docs) {
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
            residentId,
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
                    residentId: residentId,
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
        userRedeemPoints: function (residentId, redeemedPoints, callBack) {
            try {
                pointsAudit.find({ residentId: residentId }).sort({ createdAt: -1 }).limit(1).then((result) => {
                    if (result.length > 0) {
                        if (result[0].availablePoints >= redeemedPoints) {
                            callBack(false, "User has available redeempoints");
                        }
                        else {
                            callBack(true, "Sorry, You don't have availablepoints to redeem");
                        }
                    }
                    else {
                        callBack(true, "Sorry, You don't have availablepoints to redeem");
                    }
                }).catch(err => {
                    callBack(true, "Error");
                });
            } catch (e) {
                callBack(true, "Error");
            }
        },
        //End of get Redeem points
        //Start Transaction details API of user
        transactionDetails: function (residentId, callBack) {
            try {
                pointsAudit.find({ residentId: residentId }).sort({ createdAt: -1 }).limit(10).then((result) => {
                    if (result.length > 0) {
                        callBack(false, result, "User transaction details");
                    }
                    else {
                        callBack(true, "don't have transaction details");
                    }
                }).catch(err => {
                    callBack(true, "Error");
                });
            } catch (e) {
                callBack(true, null);
            }
        },
        //End Transaction details API of user
        //Start points conversion 
        pointConversion: function (countryCode, redeemedPoints, callBack) {
            try {
                var currencyValue = ((parseFloat(pointDetails[countryCode].redemption.currencyValue) / parseInt(pointDetails[countryCode].redemption.numberOfPoints)) * parseInt(redeemedPoints))
                var currency = pointDetails[countryCode].countryCurrency
                callBack(false, currencyValue, currency);
            } catch (e) {
                console.log(e)
                callBack(true, null, null);
            }
        },
        //End points conversion 
        //Start deactivate points
        deactivatePoints: function (callBack) {
            try {
                pointsAudit.updateMany({
                    earnedPointsExpiryDate: {
                        $lte: new Date()
                    }
                }, {
                    $set: {
                        isActive: false
                    }
                },
                    {
                        multi: true
                    }
                )
                    .then(response => {
                        if (response.nModified == 0) {
                            // { n: 0, nModified: 0, ok: 1 }
                            callBack(false, 'No points available for expiration');
                        }
                        else {
                            callBack(false, 'Expiration done');
                        }
                    }).
                    catch(e => {
                        callBack(true, null);
                    })
            } catch (e) {
                callBack(true, null);
            }
        }
        //End deactivate points
    }
    return pointsAuditModule;
}
