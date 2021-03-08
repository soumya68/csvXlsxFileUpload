const order = require('../models/neworder-schema');
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
        // Start of  create order details
        createPointsDetails: function (orderId,
            redeemedPoints,
            pointSource, countryCode, callBack) {
            try {
                order.find({ _id: new ObjectId(orderId) }).then(orderData => {
                    console.log(orderData)
                    if (orderData.length > 0) {
                        var finalPrice = orderData[0].orderTotalPayable
                        var residentId = orderData[0].residentId
                        console.log('1567')
                        totalAvailablePoint = 0
                        var productDetails = [];
                        if (orderData[0].suppliers.length > 0) {
                            console.log('134')
                            var index = 0;
                            var supplierData = function (doc) {
                                var item = doc.items
                                console.log('item', item)
                                productDetails = productDetails.concat(item)
                                console.log('product', productDetails)
                                console.log('14')
                                index++
                                if (index < orderData[0].suppliers.length) {
                                    supplierData(orderData[0].suppliers[index]);
                                }
                                else {
                                    console.log('1')
                                    orderModule.pointsAccumulation(
                                        productDetails, finalPrice,
                                        redeemedPoints,
                                        countryCode,
                                        function (error, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints) {
                                            if (!error) {
                                                console.log('totalEarnedPoints', totalEarnedPoints)
                                                console.log('totalRedeemedPoints', totalRedeemedPoints)
                                                if (totalEarnedPoints > 0 || totalRedeemedPoints > 0) {
                                                    if (totalEarnedPoints > 0) {
                                                        var pointData = {
                                                            redeemedPoints: totalRedeemedPoints,
                                                            earnedPoints: totalEarnedPoints,
                                                            availablePoints: totalAvailablePoint,
                                                            pointSource: pointSource,
                                                            earnedPointsExpiryDate: earnedPointsExpiryDate,
                                                            residentId: residentId,
                                                            orderId: orderId,
                                                            pointsEarnedCalculation: true
                                                        }
                                                    }
                                                    else {
                                                        var pointData = {
                                                            redeemedPoints: totalRedeemedPoints,
                                                            earnedPoints: totalEarnedPoints,
                                                            availablePoints: totalAvailablePoint,
                                                            pointSource: pointSource,
                                                            earnedPointsExpiryDate: earnedPointsExpiryDate,
                                                            residentId: residentId,
                                                            orderId: orderId,
                                                            pointsEarnedCalculation: true
                                                        }
                                                    }
                                                    const ponitDetails = new pointsAudit(pointData);
                                                    ponitDetails.save().then(response => {
                                                        console.log('RESIDENT', residentId)
                                                        residents.findOneAndUpdate({ residentId: residentId },
                                                            { $inc: { availablePoints: -parseInt(totalRedeemedPoints) } },
                                                            { new: true }).then(result => {
                                                                callBack(false, "Order point created successfully");
                                                            }).catch(err => {
                                                                console.log('error', err)
                                                            });
                                                    })
                                                }
                                                else {
                                                    callBack(false, "Order point created successfully");
                                                }
                                                // })
                                            }
                                            else {
                                                callBack(true, "Error",);
                                            }
                                        })
                                }
                            }
                            if (orderData[0].suppliers.length !== 0) {
                                supplierData(orderData[0].suppliers[index]);
                            }
                        }
                        else {
                            callBack(true, "No supplier data found");
                        }
                    }
                    else {
                        callBack(true, "No order found");
                    }
                })
                    .catch(err => {
                        console.log(err)
                        callBack(true, "Error",);
                    });
            } catch (e) {
                console.log(e)
                callBack(true, "Error",);
            }
        },
        // Start of  point accumulation for create order
        pointsAccumulation: function (productDetails, finalPrice,
            redeemedPoints,
            countryCode, callBack) {
            try {
                console.log('FINAL PRICE', finalPrice)
                totalEarnedPoints = 0
                totalRedeemedPoints = 0
                totalPrice = finalPrice;
                totalAvailablePoints = 0;
                earnedPointsExpiryDate = new Date();
                if (pointDetails[countryCode].earned.minimumOrderPrice <= finalPrice) {
                    var products = productDetails
                    var index = 0;
                    var productData = function (doc) {
                        var singleProductId = doc.medicationId
                        if (doc.pointsAccumulation) {
                            var productPrice = doc.price
                            totalEarnedPoints = parseFloat(totalEarnedPoints) + Math.round(((parseFloat(pointDetails[countryCode].earned.numberOfPoints) / parseFloat(pointDetails[countryCode].earned.amountSpent)) * parseFloat(productPrice)))
                        }
                        index++;
                        if (index < products.length) {
                            productData(products[index]);
                        }
                        else {
                            if (pointDetails[countryCode].redemption.minimumOrderPrice <= finalPrice) {
                                if (redeemedPoints > 0) {
                                    totalRedeemedPoints = redeemedPoints
                                    var discountAmount = ((parseFloat(pointDetails[countryCode].redemption.currencyValue) / parseInt(pointDetails[countryCode].redemption.numberOfPoints)) * parseInt(redeemedPoints))
                                    totalPrice = parseFloat(totalPrice) - parseFloat(discountAmount)
                                    totalAvailablePoints = parseFloat(totalAvailablePoints) - parseFloat(redeemedPoints)
                                }
                            }
                            var days = pointDetails[countryCode].earnedPointsExpiryDays
                            earnedPointsExpiryDate.setDate(earnedPointsExpiryDate.getDate() + days);
                            callBack(false, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints)
                        }
                    }
                    if (products.length !== 0) {
                        productData(products[index]);
                    }
                }
                else {
                    callBack(false, totalEarnedPoints, null, finalPrice, totalRedeemedPoints)
                }
            } catch (e) {
                console.log(e)
                callBack(true, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints)
            }
        },
        // End of create order details
        pointsAccumulationBackUp: function (productDetails, finalPrice,
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
