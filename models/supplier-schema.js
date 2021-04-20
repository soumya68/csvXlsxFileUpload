var mongoose = require("mongoose");
const validator = require("validator");
const autoIncrement = require('mongoose-auto-increment');
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
                type: String,
                default: null
            },
            phone: {
                type: String,
                default: null
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
            default: 0
        },
        supplierName: {
            type: Object,
            default: {}
        },
        usdPrice: {
            type: mongoose.Decimal128,
            default: 0.00
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
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

module.exports = mongoose.model("supplier", supplierSchema);
