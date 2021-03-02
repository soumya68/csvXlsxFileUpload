const order = require('../models/order-schema');
const pointsAudit = require('../models/pointsAudit-schema');
var pointDetails = require('../utils/pointsDetails.json');
const residents = require('../models/resident-schema');
const productsModel = require('../models/catalouge-schema');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function () {
    var orderModule = {
        // Start of  create order details
        createOrder: function (productDetails, finalPrice,
            residentId,
            redeemedPoints,
            pointSource, countryCode, callBack) {
            try {
                residents.find({ residentId: residentId }).then(user => {
                    if (user.length > 0) {
                        totalAvailablePoint = user[0].availablePoints
                        orderModule.pointsAccumulation(
                            productDetails, finalPrice,
                            redeemedPoints,
                            countryCode,
                            function (error, totalEarnedPoints, earnedPointsExpiryDate, totalPrice) {
                                if (!error) {
                                    var orderData = {
                                        residentId: residentId,
                                        productDetails: JSON.parse(productDetails),
                                        finalPrice: totalPrice,
                                        date: new Date()
                                    }
                                    totalAvailablePoint = parseInt(totalAvailablePoint) + parseInt(totalEarnedPoints)
                                    const orderDetails = new order(orderData);
                                    orderDetails.save().then(response => {
                                        if (totalEarnedPoints > 0 || redeemedPoints > 0) {
                                            if (totalEarnedPoints > 0) {
                                                var pointData = {
                                                    redeemedPoints: redeemedPoints,
                                                    earnedPoints: totalEarnedPoints,
                                                    availablePoints: totalAvailablePoint,
                                                    pointSource: pointSource,
                                                    earnedPointsExpiryDate: earnedPointsExpiryDate,
                                                    residentId: residentId,
                                                    orderId: response._id
                                                }
                                            }
                                            else {
                                                var pointData = {
                                                    redeemedPoints: redeemedPoints,
                                                    earnedPoints: totalEarnedPoints,
                                                    availablePoints: totalAvailablePoint,
                                                    pointSource: pointSource,
                                                    earnedPointsExpiryDate: earnedPointsExpiryDate,
                                                    residentId: residentId,
                                                    orderId: response._id
                                                }
                                            }
                                            const ponitDetails = new pointsAudit(pointData);
                                            ponitDetails.save().then(resp => {
                                                callBack(false, response, "Order created successfully");
                                            })
                                        }
                                        else {
                                            callBack(false, response, "Order created successfully");
                                        }
                                    })
                                }
                                else {
                                    callBack(true, error, "Error",);
                                }
                            })
                    }
                    else {
                        callBack(true, null, "No user found");
                    }
                })
                    .catch(err => {
                        callBack(true, err, "Error",);
                    });
            } catch (e) {
                callBack(true, e, "Error",);
            }
        },
        // Start of  point accumulation for create order
        pointsAccumulation: function (productDetails, finalPrice,
            redeemedPoints,
            countryCode, callBack) {
            try {
                totalEarnedPoints = 0
                totalPrice = finalPrice;
                totalAvailablePoints = 0;
                if (pointDetails[countryCode].earned.minimumOrderPrice <= finalPrice) {
                    var products = JSON.parse(productDetails)
                    var index = 0;
                    var productData = function (doc) {
                        var singleProductId = doc.productId
                        productsModel.find({ _id: new ObjectId(singleProductId) }).then(prod => {
                            if (prod.length > 0) {
                                if (prod[0].pointsAccumulation) {
                                    var productPrice = doc.price
                                    totalEarnedPoints = parseFloat(totalEarnedPoints) + Math.round(((parseFloat(pointDetails[countryCode].earned.numberOfPoints) / parseFloat(pointDetails[countryCode].earned.amountSpent)) * parseFloat(productPrice)))
                                }
                            }
                            else {
                                console.log('NO PRODUCT FOUND')
                            }
                            index++;
                            if (index < products.length) {
                                productData(products[index]);
                            }
                            else {
                                if (pointDetails[countryCode].redemption.minimumOrderPrice <= finalPrice) {
                                    if (redeemedPoints > 0) {
                                        var discountAmount = ((parseFloat(pointDetails[countryCode].redemption.currencyValue) / parseInt(pointDetails[countryCode].redemption.numberOfPoints)) * parseInt(redeemedPoints))
                                        totalPrice = parseFloat(totalPrice) - parseFloat(discountAmount)
                                        totalAvailablePoints = parseFloat(totalAvailablePoints) - parseFloat(redeemedPoints)
                                    }
                                }
                                var earnedPointsExpiryDate = new Date();
                                var days = pointDetails[countryCode].earnedPointsExpiryDays
                                earnedPointsExpiryDate.setDate(earnedPointsExpiryDate.getDate() + days);
                                callBack(false, totalEarnedPoints, earnedPointsExpiryDate, totalPrice)
                            }
                        })
                            .catch(e => {
                                callBack(true, totalEarnedPoints, earnedPointsExpiryDate, totalPrice)
                            })
                    }
                    if (products.length !== 0) {
                        productData(products[index]);
                    }
                }
                else {
                    callBack(false, totalEarnedPoints, null, finalPrice)
                }
            } catch (e) {
                callBack(true, totalEarnedPoints, earnedPointsExpiryDate, totalPrice)
            }
        },
        // End of create order details
    }
    return orderModule;
}
