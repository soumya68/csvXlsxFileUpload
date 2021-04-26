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
                postal_code: {
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

            }
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
var customeCollectionName = 'Supplier'
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("supplier", supplierSchema, customeCollectionName);






 // var addressLine1: String? = null
        // var addressLine2: String? = null
        // var city: String? = null
        // var country: String? = null
        // var district: String? = null
        // var isoCountry: String? = null
        // var postal_code: String? = null
        // var directions: String? = null
        // var landmark: String? = null
        // var location: String? = null
        // var region: String? = null
        // var town: String? = null
        // var zip: String? = null
