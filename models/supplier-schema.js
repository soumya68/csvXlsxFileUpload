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
                type: String,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email",
                  },
                  default:null
            },
            phone: {
                type: String,
                default:null
            },
        },
        deliveryFee: {
            type: Number,
            default:0
        },
        isoCountry: {
            type: String,
            default:null
        },
        lastProductSeq: {
            type: Number,
            default:0
        },
        supplierCode: {
            type: Number,
            default:0        },
        supplierName: {
            type: Object,
            default:{}
        },
        type: {
            type: String,
            default:null
        },
        usdPrice: {
            type: Number,
            default:0
        },
        metadata: {
            createdBy: {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required:true
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
                default:0
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
