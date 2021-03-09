var mongoose = require("mongoose");
const validator = require("validator");
var orderSchema = new mongoose.Schema(
    {
        delivery: {
            type: Number,
            default: 0
        },
        discount: {
            type: Object,
            default: {}
        },
        discountIdNumber: {
            type: Number,
            default: 0
        },
        isoCountry: {
            type: String,
            required: true,
        },
        isoCurrency: {
            type: String,
            required: true,
        },
        metadata: {
            createdBy: {
                userId: {
                    type: String,
                    required: true
                },
                utcDatetime: {
                    type: Date
                },
            },
            updatedBy: {
                type: Array,
                default: []
            },
            version: {
                type: String,
                default: 0
            },
        },
        orderSubTotal: {
            type: mongoose.Decimal128,
            default: '0.00'
        },
        orderTotalPayable: {
            type: mongoose.Decimal128,
            default: '0.00'
        },
        pointBasedDiscountedAmount: {
            type: mongoose.Decimal128,
            default: '0.00'
        },
        canRedeemPoints: {
            type: Boolean,
            default: false
        },
        isPointsAddedToResident: {
            type: Boolean,
            default: false
        },
        isEarnedPointCalculated:{
            type: Boolean,
            default: false
        },
        patientAddress: {
            type: Object,
            default: {}
        },
        patientAge: {
            type: Number,
            default: 0
        },
        patientGender: {
            type: String,
            default: 0
        },
        patientName: {
            type: String,
            default: 0
        },
        prescriptionNumber: {
            type: String,
            default: 0
        },
        recipient: {
            type: String,
            default: 0
        },
        residentId: {
            type: String,
            default: 0
        },
        currentStatus: {
            type: Object,
            default: {}
        },
        supplierOrderId: {
            type: String,
            default: 0
        },
        orderStatus: {
            type: String,
            default: 0
        },
        subOrders: {
            type: Array,
            default: []
        },
        taxPayable: {
            type: Number,
            default: 0
        },
        trackingCode: {
            type: String,
            default: 0
        },
        type: {
            type: String,
            default: 0
        },
        ///////////
        residentId: {
            type: String,
            required: true,
        },
        productDetails: {
            type: Array,
            default: []
        },
        deliveryAddress: {
            type: String,
            //required: true,
            min: 6,
            trim: true,
        },
        isDelivered: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
module.exports = mongoose.model("neworder", orderSchema);
// [
//     {
//             "delivery": 24,
//             "discount": {},
//             "discountIdNumber": "(@+@+@",
//             "isoCountry": "phl",
//             "isoCurrency": "php",
//             "metadata": {
//                 "createdBy": {
//                     "userId": "5f97ed2f11a3620021283867",
//                     "utcDateTime": "2021-02-24T15:04:52.553Z"
//                 },
//                 "updatedBy": [],
//                 "version": 1
//             },
//             "orderSubTotal": 454.25,
//             "orderTotalPayable": 478.25,
//             "patientAddress": {
//                 "addressLine1": "St. Gilop",
//                 "country": "Philippines",
//                 "isoCountry": "phl",
//                 "villageCode": "",
//                 "zip": "4949"
//             },
//             "patientAge": 30,
//             "patientGender": "Female",
//             "patientName": "Gerald, Caraga",
//             "prescriptionNumber": "RX817262",
//             "recipient": "",
//             "residentId": "7c0ff871-0092-4f45-8530-1729f941bb93",
//             "currentStatus": {
//                 "reason": "ID/Rx and DisperGo Mismatch",
//                 "reasonCode": "rc3",
//                 "status": "REJECTED",
//                 "statusDate": "2021-03-01T06:43:34.068Z",
//                 "userDisplayName": "juan  dela cruz",
//                 "username": "pharmacist@reach52.com"
//             },
//             "supplierOrderId": "1000",
//             "orderStatus": "",
//             "suppliers": [
//                 {
//                     "supplierSubOrderID": "101",
//                     "supplierSubOrderStatus": [],
//              "subOrderSubTotal": 227.25,
//                  "subOrderTotalPayable": 239.25,
//                      "pastStatuses": [
//                         {
//                             "status": "PENDING",
//                             "statusDate": "2021-02-24T15:04:52.552Z",
//                             "userDisplayName": "Manual De Latore",
//                             "userId": "5f97ed2f11a3620021283867"
//                         }
//                     ],
//                     "deliveryFee": 24,
//                     "email": "delight@reach52.com",
//                     "id": "f4e00bb6410c29f221a1dd6dd8fd69c0",
//                     "isoCountry": "phl",
//                     "phone": "123345",
//                     "r52SuppCode": "DELI",
//                     "status": 1,
//                     "supplierCode": "DELI",
//                     "supplierName": "Delight",
//                     "items": [
//                         {
//                             "brandName": "Surf (Purple Blooms) 65g",
//                             "description": "NA",
//                             "dosage": "N/A",
//                             "form": "Powder",
//                             "genericName": "Laundry Soap",
//                             "information": "",
//                             "ingredients": [],
//                             "lineSubTotal": 47.53,
//                             "medicationId": "0109d4273f1ebfccbb433e6ed1764e81",
//                             "packageSize": 1,
//                             "packageUnit": "",
//                             "prescriptionRequired": false,
//                             "price": 5.82,
//                             "qty": 1,
//                             "qtyOriginal": 1,
//                             "r52SuppCode": "DELI",
//                             "status": "requested",
//                             "statusReason": "",
//                             "suppCatNo": "DELI",
//                             "supplier": "Delight",
//                             "tax": {
//                                 "category": "included",
//                                 "included": true,
//                                 "percentage": 12,
//                                 "type": "vat"
//                             }
//                         },
//                         {
//                             "brandName": "Champion (Blue) long bar",
//                             "description": "NA",
//                             "dosage": "N/A",
//                             "form": "Bar",
//                             "genericName": "Detergent",
//                             "information": "",
//                             "ingredients": [],
//                             "lineSubTotal": 47.53,
//                             "medicationId": "273d02564c060f998d0a72b1289ec556",
//                             "packageSize": 1,
//                             "packageUnit": "",
//                             "prescriptionRequired": false,
//                             "price": 22.31,
//                             "qty": 1,
//                             "qtyOriginal": 1,
//                             "r52SuppCode": "DELI",
//                             "status": "requested",
//                             "statusReason": "",
//                             "suppCatNo": "DELI",
//                             "supplier": "Delight",
//                             "tax": {
//                                 "category": "included",
//                                 "included": true,
//                                 "percentage": 12,
//                                 "type": "vat"
//                             }
//                         }
//                     ]
//                 },
//                 {
//                     "supplierSubOrderID": "102",
//                     "supplierSubOrderStatus": [],
//                     "subOrderSubTotal": 227,
//                     "subOrderTotalPayable": 239,
//                     "pastStatuses": [
//                         {
//                             "status": "PENDING",
//                             "statusDate": "2021-02-24T15:04:52.552Z",
//                             "userDisplayName": "Manual De Latore",
//                             "userId": "5f97ed2f11a3620021283867"
//                         }
//                     ],
//                     "deliveryFee": "24",
//                     "email": "josm@gmail.com",
//                     "id": "c018b603f8758beb09513fe8b3d774d7",
//                     "isoCountry": "phl",
//                     "phone": "123345",
//                     "r52SuppCode": "JOSM",
//                     "status": 1,
//                     "supplierCode": "JOSM",
//                     "supplierName": "Josmef",
//                     "items": [
//                         {
//                             "brandName": "Pride (Blue) long bar",
//                             "description": "NA",
//                             "dosage": "N/A",
//                             "form": "Bar",
//                             "genericName": "Laundry Soap",
//                             "information": "",
//                             "ingredients": [],
//                             "lineSubTotal": 47.53,
//                             "medicationId": "315600b99063b25b555ac4d2e0755636",
//                             "packageSize": 1,
//                             "packageUnit": "",
//                             "prescriptionRequired": false,
//                             "price": 19.4,
//                             "qty": 1,
//                             "qtyOriginal": 1,
//                             "r52SuppCode": "JOSM",
//                             "status": "requested",
//                             "statusReason": "",
//                             "suppCatNo": "JOSM",
//                             "supplier": "JOSM",
//                             "tax": {
//                                 "category": "included",
//                                 "included": true,
//                                 "percentage": 12,
//                                 "type": "vat"
//                             }
//                         }
//                     ]
//                 }
//             ],
//             "taxPayable": 0,
//             "trackingCode": "Kc2J2GCKrHiBTGmGy4F7t",
//             "type": "order"
//     }
//     ]