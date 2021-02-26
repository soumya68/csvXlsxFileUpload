const order = require('../models/order-schema');
const pointsAudit = require('../models/pointsAudit-schema');
var pointDetails = require('../utils/pointsDetails.json');
const residents = require('../models/resident-schema');
module.exports = function () {
    var orderModule = {
        // Start of  create order details
        createOrder: function (productDetails, finalPrice,
            userId,
            redeemedPoints,
            pointSource, countryCode, callBack) {
            try {
                residents.find({ residentId: userId }).then(user => {
                    console.log(user)
                    if(user.length>0){
                        var earnedPointsExpiryDate = new Date();
                        var days = pointDetails[countryCode].earnedPointsExpiryDays
                        earnedPointsExpiryDate.setDate(earnedPointsExpiryDate.getDate() + days);
                        totalEarnedPoints = 0;
                        totalPrice = finalPrice;
                        totalAvailablePoints = user[0].availablePoints;
                        if (parseFloat(finalPrice) >= parseFloat(pointDetails[countryCode].orderTotalPrice)) {
                            totalEarnedPoints = pointDetails[countryCode].pointsAmount
                            // totalAvailablePoints = parseFloat(availablePoints) + parseFloat(totalEarnedPoints)
                        }
                        if (redeemedPoints > 0) {
                            var discountAmount = (parseFloat(pointDetails[countryCode].conversionAmount) * parseFloat(redeemedPoints)) / parseFloat(pointDetails[countryCode].points)
                            totalPrice = parseFloat(finalPrice) - parseFloat(discountAmount)
                            totalAvailablePoints = parseFloat(totalAvailablePoints) - parseFloat(redeemedPoints)
                        }
                        var orderData = {
                            userId: userId,
                            productDetails: JSON.parse(productDetails),
                            finalPrice: totalPrice,
                            isDelivered: false,
                            date: new Date()
                        }
                        totalAvailablePoints = parseFloat(totalAvailablePoints) + parseFloat(totalEarnedPoints)
                        const orderDetails = new order(orderData);
                        orderDetails.save().then(response => {
                            response.availablePoints = totalAvailablePoints
                            if (totalEarnedPoints > 0 || redeemedPoints > 0) {
                                if (totalEarnedPoints > 0) {
                                    var pointData = {
                                        redeemedPoints: redeemedPoints,
                                        earnedPoints: totalEarnedPoints,
                                        availablePoints: totalAvailablePoints,
                                        pointSource: pointSource,
                                        earnedPointsExpiryDate: earnedPointsExpiryDate,
                                        isActive: true,
                                        userId: userId,
                                        orderId: response._id
                                    }
                                }
                                else {
                                    var pointData = {
                                        redeemedPoints: redeemedPoints,
                                        earnedPoints: totalEarnedPoints,
                                        availablePoints: totalAvailablePoints,
                                        pointSource: pointSource,
                                        earnedPointsExpiryDate: earnedPointsExpiryDate,
                                        isActive: false,
                                        userId: userId,
                                        orderId: response._id
                                    }
                                }
                                const ponitDetails = new pointsAudit(pointData);
                                ponitDetails.save().then(resp => {
                                    let updates = {
                                        availablePoints: totalAvailablePoints
                                    }
                                    residents.findOneAndUpdate({ residentId: userId },
                                        { $set: updates },
                                        { new: true }).then(re => {
                                            callBack(false, response, "Order created successfully");
                                        })
                                })
                            }
                            else {
                                callBack(false, response, "Order created successfully");
                            }
                        })
                    }
                    else{
                        callBack(true, null, "No user found");
                    }
               
                })
                    .catch(err => {
                        console.log(err)
                        callBack(true, err, "Error",);
                    });
            } catch (e) {
                console.log(e)
                callBack(true, null);
            }
        },
        // End of create order details
    }
    return orderModule;
}
