var mongoose = require("mongoose");
const validator = require("validator");
const autoIncrement = require('mongoose-auto-increment');
var supplierSchema = new mongoose.Schema(
    {
        _partition: {
            type: String,
            default: "101"
        },
        catalogTags: {
            type: Array,
            default: []
        },
        contact: {
            address: {
                addressLine1: {
                    type: String,
                },
                addressLine2: {
                    type: String,
                },
                city: {
                    type: String,
                },
                country: {
                    type: String,
                },
                district: {
                    type: String,
                },
                isoCountry: {
                    type: String,
                },
                postalCode: {
                    type: String,
                },
                directions: {
                    type: String,
                },
                landmark: {
                    type: String,
                },
                region: {
                    type: String,
                },
                town: {
                    type: String,
                },
                zip: {
                    type: String,
                },
            },
            email: {
                type: String,
            },
            phone: {
                type: String,
            },
        },
        deliveryFee: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        isoCountry: {
            type: String,
            default: null
        },
        lastProductSeq: {
            type: String,
            default: null
        },
        supplierCode: {
            type: String,
            default: '0'
        },
        supplierName: {
            eng: {
                type: String
            }
        },
        usdPrice: {
            type: mongoose.Decimal128,
            default: 0.00
        },
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
            userId: {
                type: String,
                required: true
            },
            utcDatetime: {
                type: Date
            },
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
var customeCollectionName = 'Suppliers'
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("supplier", supplierSchema, customeCollectionName);
