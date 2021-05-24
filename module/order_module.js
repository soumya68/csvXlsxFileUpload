const order = require('../models/order-schema');
const pointsAudit = require('../models/pointsAudit-schema');
var pointDetails = require('../utils/pointsDetails.json');
const residents = require('../models/resident-schema');
const productsModel = require('../models/catalouge-schema');
module.exports = function () {
    var orderModule = {
        // Start of  create order details
        createPointsDetails: function (orderId,
            redeemedPoints,
            pointSource, countryCode, callBack) {
            try {
                // FIND ORDER DETAILS BY ORDER ID
                order.find({ _id: orderId }).then(orderData => {
                    // CHECK ANY ORDER FOUND OR NOT
                    if (orderData.length > 0) {
                        // IF ANY ORDER FOUND
                        var finalPrice = orderData[0].orderTotalPayable
                        var residentId = orderData[0].residentId
                        totalAvailablePoint = 0
                        var productDetails = [];
                        // SUBORDER DETAILS
                        var subOrdersDetails = orderData[0].subOrders
                        // CHECK IF SUBORDER DETAILS HAS ANY SUBORDER OR EMPTY
                        if (subOrdersDetails.length > 0) {
                            // IF SUB ORDER FOUND
                            var index = 0;
                            // SUBORDERDATA FUNCTION START
                            var subOrdersData = function (doc) {
                                // GET ITEM DETAILS OF ITEM ARRAY
                                var item = doc.items
                                // ADD THOESE ITEMS WITH PREVIOUS PRODUCT DEATILS ARRAY
                                productDetails = productDetails.concat(item)
                                index++
                                // CHECK IF ANY MORE SUB ORDER IS AVAILABLE OR NOT
                                if (index < subOrdersDetails.length) {
                                    // IF ANY MORE SUBORDER AVAILABLE ,THEN CALL THE SUBORDERDATA FUNCTION AGAIN
                                    subOrdersData(subOrdersDetails[index]);
                                }
                                else {
                                    // IF NO MORE SUBORDER FOUND , THEN PASS REQUIRED DATAS TO POINTS ACCUMULATION FUNCTION
                                    orderModule.pointsAccumulation(
                                        productDetails, finalPrice,
                                        redeemedPoints,
                                        countryCode,
                                        function (error, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints, discountAmount) {
                                            if (!error) {
                                                //IF NO ERROR FOUND ,THEN GET FINAL PRICE & UPDATE PERTICULAR ORDER DATAS
                                                finalPrice = parseFloat(finalPrice - discountAmount).toFixed(2)
                                                order.findOneAndUpdate({ _id: orderId },
                                                    {
                                                        $set: {
                                                            orderTotalPayable: finalPrice,
                                                            pointBasedDiscountedAmount: parseFloat(discountAmount).toFixed(2),
                                                            isEarnedPointCalculated: true
                                                        }
                                                    },
                                                )
                                                    .then(result => {
                                                        console.log(totalEarnedPoints,totalRedeemedPoints)
                                                        // CHECK IF IS THERE ANY totalEarnedPoints OR totalRedeemedPoints 
                                                        if (totalEarnedPoints > 0 || totalRedeemedPoints > 0) {
                                                            // IF  totalEarnedPoints IS AVAILABLE
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
                                                            // SAVE POINTS DETAILS IN POINTSAUDIT COLLECTION 
                                                            ponitDetails.save().then(response => {
                                                                // UPDATE AVAILABLE POINT OF THAT RESIDENT BY SUBSTRACTING REEDEM POINTS FROM AVAILABLE POINTS
                                                                //  residents.findOneAndUpdate({ residentId: residentId },
                                                                residents.findOneAndUpdate({ _id: residentId },
                                                                    { $inc: { availablePoints: -parseInt(totalRedeemedPoints) } },
                                                                    { new: true }).then(result => {
                                                                        callBack(false, "Order point created successfully", discountAmount, finalPrice, totalEarnedPoints);
                                                                    }).catch(err => {
                                                                        callBack(true, "Error", 0, 0, 0);
                                                                    });
                                                            })
                                                        }
                                                        else {
                                                            // IF NO EARNED POINT OR REDEEM POINT AVAILABLE FOR THIS ORDER
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
                            // CHECK IF ANY SUBORDER IS FOUND OR NOT
                            if (subOrdersDetails.length !== 0) {
                                // IF ANY SUBORDER IS FOUND THEN CALL SUBORDERDATA FUNCTION
                                subOrdersData(subOrdersDetails[index]);
                            }
                        }
                        else {
                            // if no suborder found
                            callBack(true, "No suborder data found");
                        }
                    }
                    else {
                        // if no order found 
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
                var renamedCountry = countryCode.toUpperCase();
                //  if (pointDetails[countryCode].earned.minimumOrderPrice <= finalPrice) {
                var products = productDetails
                var index = 0;
                var productData = function (doc) {
                    var singleProductId = doc.medicationId
                    console.log(doc.pointsAccumulation)
                    if (doc.pointsAccumulation) {
                        var productPrice = doc.price.toString()
                        console.log(productPrice)
                        totalEarnedPoints = parseFloat(totalEarnedPoints) + Math.round(((parseFloat(pointDetails[renamedCountry].earned.numberOfPoints) / parseFloat(pointDetails[renamedCountry].earned.amountSpent)) * parseFloat(productPrice)))
                        console.log(totalEarnedPoints,parseFloat(pointDetails[renamedCountry].earned.numberOfPoints),pointDetails[renamedCountry].earned.amountSpent,parseFloat(productPrice))
                    }
                    index++;
                    if (index < products.length) {
                        productData(products[index]);
                    }
                    else {
                        //  if (pointDetails[countryCode].redemption.minimumOrderPrice <= finalPrice) {
                        if (redeemedPoints > 0) {
                            totalRedeemedPoints = redeemedPoints
                            discountAmount = ((parseFloat(pointDetails[renamedCountry].redemption.currencyValue).toFixed(2) / parseInt(pointDetails[renamedCountry].redemption.numberOfPoints)) * parseInt(redeemedPoints))
                            totalPrice = parseFloat(totalPrice) - parseFloat(discountAmount)
                            totalAvailablePoints = parseFloat(totalAvailablePoints) - parseFloat(redeemedPoints)
                        }
                        //   }
                        var days = pointDetails[renamedCountry].earnedPointsExpiryDays
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
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Start To get the points earned after successfully deliver
        pointsupdate: function (orderId, callBack) {
            try {
                pointsAudit.find({ orderId: orderId }).then((result) => {
                    if (result.length > 0) {
                        //   if (result[0].isActive == false) {
                        // To update points in the collections
                        residents.findOneAndUpdate({ _id: result[0].residentId },
                            { $inc: { availablePoints: parseInt(result[0].earnedPoints) } },
                            { new: true }).then(data => {
                                order.findOneAndUpdate({ _id: orderId },
                                    { $set: { isDelivered: true, isPointsAddedToResident: true } },
                                    { new: true }).then(data => {
                                        pointsAudit.findOneAndUpdate({ orderId: orderId },
                                            { $set: { isActive: true } },
                                            { new: true }).then(data => {
                                                callBack(false, "Order status updated successfully");
                                            })
                                    })
                            }).catch(err => {
                                callBack(true, "Error");
                            });
                        // }
                        // else {
                        //     callBack(true, "No delivery products");
                        // }
                    }
                    else {
                        callBack(true, "No point details found for this order");
                    }
                }).catch(err => {
                    callBack(true, "Error");
                });
            } catch (e) {
                callBack(true, "Error");
            }
        },
        //Start To get the points earned after successfully deliver
        ////////////////////////////////////////////////////////////////////////////////////
        //Start to update the order status for cron job
        updateOrderStatus: async function (callbackfn) {
            try {
                let result = await order.find({ isPointsAddedToResident: false })
                if (result.length > 0) {
                    Promise.all(
                        result.map(async ele => {
                            // Update order status and points in the collections
                            let orderdata = await order.findOneAndUpdate({ _id: ele._id },
                                { $set: { isDelivered: true, isPointsAddedToResident: true } },
                                { new: true })
                            let auditdata = await pointsAudit.findOneAndUpdate({ orderId: ele._id },
                                { $set: { isActive: true } },
                                { new: true })
                            let points = auditdata.earnedPoints
                            let residentdata = await residents.findOneAndUpdate({ _id: auditdata.residentId },
                                { $inc: { availablePoints: parseInt(points) } },
                                { new: true })
                            let finalData = { ...orderdata, ...auditdata, ...residentdata }
                            return finalData
                        })
                    ).then(function (documents) {
                    });
                    callbackfn(null, finalData);
                }
                else {
                    callbackfn(null, 'No data');
                }
            } catch (err) {
                callbackfn(err, null,);
            }
        },
        //End to update the order status for cron job
        //End of cron job for update earnedpoint calculated
        updatePointsCalculated: function (callbackfn) {
            try {
                order.find({ isEarnedPointCalculated: false }).then(result => {
                    if (result.length > 0) {
                        result.map(ele => {
                            var orderId = ele._id;
                            var redeemedPoints = 0;
                            var countryCode = ele.isoCountry;
                            var renamedCountry = countryCode.toUpperCase();
                            var pointSource = 'order'
                            orderModule.cronCreatePointsDetails(orderId, redeemedPoints, pointSource, renamedCountry, function (err, res) {
                                if (err) {
                                }
                                else {
                                }
                            })
                        })
                    }
                    else {
                        callbackfn(null, 'No data');
                    }
                }).catch(err => {
                    callbackfn(true, "Error");
                });
            } catch (err) {
                callbackfn(err, null,);
            }
        },
        cronCreatePointsDetails: function (orderId, redeemedPoints, pointSource, countryCode, callBack) {
            try {
                // FIND ORDER DETAILS BY ORDER ID
                order.find({ _id: orderId }).then(orderData => {
                    // CHECK ANY ORDER FOUND OR NOT
                    if (orderData.length > 0) {
                        // IF ANY ORDER FOUND
                        var finalPrice = orderData[0].orderTotalPayable
                        var residentId = orderData[0].residentId
                        totalAvailablePoint = 0
                        var productDetails = [];
                        // SUBORDER DETAILS
                        var subOrdersDetails = orderData[0].subOrders
                        // CHECK IF SUBORDER DETAILS HAS ANY SUBORDER OR EMPTY
                        if (subOrdersDetails.length > 0) {
                            // IF SUB ORDER FOUND
                            var index = 0;
                            // SUBORDERDATA FUNCTION START
                            var subOrdersData = function (doc) {
                                // GET ITEM DETAILS OF ITEM ARRAY
                                var item = doc.items
                                // ADD THOESE ITEMS WITH PREVIOUS PRODUCT DEATILS ARRAY
                                productDetails = productDetails.concat(item)
                                index++
                                // CHECK IF ANY MORE SUB ORDER IS AVAILABLE OR NOT
                                if (index < subOrdersDetails.length) {
                                    // IF ANY MORE SUBORDER AVAILABLE ,THEN CALL THE SUBORDERDATA FUNCTION AGAIN
                                    subOrdersData(subOrdersDetails[index]);
                                }
                                else {
                                    // IF NO MORE SUBORDER FOUND , THEN PASS REQUIRED DATAS TO POINTS ACCUMULATION FUNCTION
                                    orderModule.pointsAccumulation(
                                        productDetails, finalPrice,
                                        redeemedPoints,
                                        countryCode,
                                        function (error, totalEarnedPoints, earnedPointsExpiryDate, totalPrice, totalRedeemedPoints, discountAmount) {
                                            if (!error) {
                                                //IF NO ERROR FOUND ,THEN GET FINAL PRICE & UPDATE PERTICULAR ORDER DATAS
                                                finalPrice = parseFloat(finalPrice - discountAmount).toFixed(2)
                                                order.findOneAndUpdate({ _id: orderId },
                                                    {
                                                        $set: {
                                                            orderTotalPayable: finalPrice,
                                                            pointBasedDiscountedAmount: parseFloat(discountAmount).toFixed(2),
                                                            isEarnedPointCalculated: true
                                                        }
                                                    },
                                                )
                                                    .then(result => {
                                                        // CHECK IF IS THERE ANY totalEarnedPoints OR totalRedeemedPoints 
                                                        if (totalEarnedPoints > 0 || totalRedeemedPoints > 0) {
                                                            // IF  totalEarnedPoints IS AVAILABLE
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
                                                            // SAVE POINTS DETAILS IN POINTSAUDIT COLLECTION 
                                                            ponitDetails.save().then(response => {
                                                                // UPDATE AVAILABLE POINT OF THAT RESIDENT BY SUBSTRACTING REEDEM POINTS FROM AVAILABLE POINTS
                                                                //  residents.findOneAndUpdate({ residentId: residentId },
                                                                residents.findOneAndUpdate({ _id: residentId },
                                                                    { $inc: { availablePoints: -parseInt(totalRedeemedPoints) } },
                                                                    { new: true }).then(result => {
                                                                        callBack(false, "Order point created successfully", discountAmount, finalPrice, totalEarnedPoints);
                                                                    }).catch(err => {
                                                                        callBack(true, "Error", 0, 0, 0);
                                                                    });
                                                            })
                                                        }
                                                        else {
                                                            // IF NO EARNED POINT OR REDEEM POINT AVAILABLE FOR THIS ORDER
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
                            // CHECK IF ANY SUBORDER IS FOUND OR NOT
                            if (subOrdersDetails.length !== 0) {
                                // IF ANY SUBORDER IS FOUND THEN CALL SUBORDERDATA FUNCTION
                                subOrdersData(subOrdersDetails[index]);
                            }
                        }
                        else {
                            // if no suborder found
                            callBack(true, "No suborder data found");
                        }
                    }
                    else {
                        // if no order found
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
        // End of cron job for update earnedpoint calculated
    }
    return orderModule;
}
