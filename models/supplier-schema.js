var mongoose = require("mongoose");
const validator = require("validator");
var supplierSchema = new mongoose.Schema(
    {
        catalogTags: {
            type: Array,
            default: []
        },
        contact: {
            address: {
                type: Array,
                default: []
            },
            email: {
                type: String
            },
            phone: {
                type: String
            },

        },
        deliveryFee: {
            type: Number
        },
        isoCountry: {
            type: String
        },
        lastProductSeq: {
            type: Number
        },
        supplierCode: {
            type: Number
        },
        supplierName: {
            type: Object,
            default:{}
        },
        type: {
            type: String
        },
        usdPrice: {
            type: Number
        },
        metadata: {
            createdBy: {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
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
                type: String
            },
        },
        // "contact": {
        //     "address": [],
        //     "email": "",
        //     "phone": ""
        // },
        // "deliveryFee": 24,
        // "isoCountry": "phl",
        // "lastProductSeq": 1177,
        // "metadata": {
        //     "createdBy": {
        //         "userId": "ryann",
        //         "utcDatetime": "2020-11-20T06:41:38.116Z"
        //     },
        //     "updatedBy": [],
        //     "version": 2
        // },
        // "supplierCode": "KING",
        // "supplierName": {
        //     "eng": "King Lee Pharmacy"
        // },
        // "type": "medicationSupplier",
        // "usdPrice": 0

    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
module.exports = mongoose.model("supplier", supplierSchema);
