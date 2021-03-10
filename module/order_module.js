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
                    if (orderData.length > 0) {
                        var finalPrice = orderData[0].orderTotalPayable
                        var residentId = orderData[0].residentId
                        totalAvailablePoint = 0
                        var productDetails = [];
                        if (orderData[0].subOrders.length > 0) {
                            var index = 0;
                            var subOrdersData = function (doc) {
                                var item = doc.items
                                productDetails = productDetails.concat(item)
                                index++
                                if (index < orderData[0].subOrders.length) {
                                    subOrdersData(orderData[0].subOrders[index]);
                                }
                                else {
                                    orderModule.pointsAccumulation(
                                        productDetails, finalPrice,
                                        redeemedPoints,
                                        countryCode,
                                        function (error, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints, discountAmount) {
                                            if (!error) {
                                                finalPrice = parseFloat(finalPrice - discountAmount).toFixed(2)
                                                order.findOneAndUpdate({ _id: new ObjectId(orderId) },
                                                    {
                                                        $set: {
                                                            orderTotalPayable: finalPrice,
                                                            pointBasedDiscountedAmount: parseFloat(discountAmount).toFixed(2),
                                                            isEarnedPointCalculated: true
                                                        }
                                                    },
                                                )
                                                    .then(result => {
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
                                                                residents.findOneAndUpdate({ residentId: residentId },
                                                                    { $inc: { availablePoints: -parseInt(totalRedeemedPoints) } },
                                                                    { new: true }).then(result => {
                                                                        callBack(false, "Order point created successfully", discountAmount, finalPrice, totalEarnedPoints);
                                                                    }).catch(err => {
                                                                        callBack(true, "Error", 0, 0, 0);
                                                                    });
                                                            })
                                                        }
                                                        else {
                                                            callBack(false, "Order point created successfully", discountAmount, finalPrice, totalEarnedPoints);
                                                        }
                                                        // callBack(false, "Order point created successfully");
                                                    }).catch(err => {
                                                        callBack(true, "Error", 0, 0, 0);
                                                    })
                                                // })
                                            }
                                            else {
                                                callBack(true, "Error", 0, 0, 0);
                                            }
                                        })
                                }
                            }
                            if (orderData[0].subOrders.length !== 0) {
                                subOrdersData(orderData[0].subOrders[index]);
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
                        callBack(true, "Error",);
                    });
            } catch (e) {
                callBack(true, "Error",);
            }
        },
        // Start of  point accumulation for create order
        pointsAccumulation: function (productDetails, finalPrice,
            redeemedPoints,
            countryCode, callBack) {
            try {
                totalEarnedPoints = 0
                totalRedeemedPoints = 0
                totalPrice = finalPrice;
                totalAvailablePoints = 0;
                discountAmount = 0.00;
                earnedPointsExpiryDate = new Date();
                //  if (pointDetails[countryCode].earned.minimumOrderPrice <= finalPrice) {
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
                        //  if (pointDetails[countryCode].redemption.minimumOrderPrice <= finalPrice) {
                        if (redeemedPoints > 0) {
                            totalRedeemedPoints = redeemedPoints
                            discountAmount = ((parseFloat(pointDetails[countryCode].redemption.currencyValue).toFixed(2) / parseInt(pointDetails[countryCode].redemption.numberOfPoints)) * parseInt(redeemedPoints))
                            totalPrice = parseFloat(totalPrice) - parseFloat(discountAmount)
                            totalAvailablePoints = parseFloat(totalAvailablePoints) - parseFloat(redeemedPoints)
                        }
                        //   }
                        var days = pointDetails[countryCode].earnedPointsExpiryDays
                        earnedPointsExpiryDate.setDate(earnedPointsExpiryDate.getDate() + days);
                        callBack(false, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints, discountAmount)
                    }
                }
                if (products.length !== 0) {
                    productData(products[index]);
                }
                // }
                // else {
                //     callBack(false, totalEarnedPoints, null, finalPrice, totalRedeemedPoints)
                // }
            } catch (e) {
                callBack(true, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints, discountAmount)
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
                var earnedPointsExpiryDate = new Date();
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
                                callBack(true, totalEarnedPoints, earnedPointsExpiryDate, totalPrice)
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
        //Start To get the points earned after successfully deliver
         pointsupdate: function (orderId, callBack) {
         try {
            pointsAudit.find({ orderId: orderId }).then((result) => {
               let updates= {
                    availablePoints: result[0].availablePoints + result[0].earnedPoints
                }
                if (result[0].isActive==true) {
                    residents.findOneAndUpdate({ _id: orderId },
                        { $set:updates },
                        { new: true }).then(data => {
                            order.findOneAndUpdate({ _id: orderId },
                                { $set:{isDelivered : true,isPointsAddedToResident:true} },
                                { new: true }).then(data => {
                                 pointsAudit.findOneAndUpdate({ orderId: orderId },
                                    { $set:{isActive : false} },
                                    { new: true }).then(data => {
                                       callBack(false, "Order status updated successfully");
                                    })
                                })

                        }).catch(err=>{
                                });
                        
                }
                else {
                    callBack(true, "No delivery products");
                } 
            }).catch(err => {
                callBack(true, "Error");
            });
        } catch (e) {
            callBack(true, "Error");
        }
         },
    //Start To get the points earned after successfully deliver
    }
    return orderModule;
}
