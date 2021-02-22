var mongoose = require("mongoose");
var catalougeSchema = new mongoose.Schema(
    {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        //manufacturerName IS ADDED AS PER UPLOAD SHEET
        manufacturerName: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },
        //packSizeUnit IS ADDED AS PER UPLOAD SHEET
        packSizeUnit: {
            type: String,
            default:0
        },
        // productType: {
        //     type: String
        // },
        //requireRx IS ADDED AS PER UPLOAD SHEET
        requireRx: {
            type: String,
            default: 'No'
        },
        // taxName: {
        //     type: String
        // },
        // IsTaxExempt: {
        //     type: String,
        //     require: true,
        //     min: 6,
        //     default: false,
        // },
        //pricePerPack IS ADDED AS PER UPLOAD SHEET
        pricePerPack: {
            type: Number,
            default:0
        },
        ////////////////////////////////////
        isDiscounted: {
            type: Boolean,
            require: true,
            min: 6,
            default: false,
        },
        barCode: {
            type: String,
            default: 0000
        },
        brandName: {
            type: Object,
            default: {}
        },
        catalogTags: {
            type: Array,
            default: []
        },
        description: {
            type: Object,
            default: {}
        },
        dosage: {
            type: String,
            default: 0
        },
        form: {
            type: Object,
            default: {}
        },
        genericName: {
            type: Object,
            default: {}
        },
        handlingInstr: {
            type: Object,
            default: {}
        },
        information: {
            type: Object,
            default: {}
        },
        ingredients: {
            type: Object,
            default: {}
        },
        // isoCountry: {
        //     type: String
        // },
        // isoCurrency: {
        //     type: String
        // },
        medClass: {
            type: Array,
            default: []
        },
        medCode: {
            type: String,
            default: 0000
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
                default: 0
            },
        },
        packSize: {
            type: String,
            default: 0
        },
        prescriptionRequired: {
            type: Boolean,
            require: true,
            min: 6,
            default: false,
        },
        price: {
            type: Number,
            default: 0,
        },
        prodCategory: {
            type: Array,
            default: []
        },
        promotion: {
            type: Object,
            default: {}
        },
        r52CatCode: {
            type: String,
            default: 0000,
        },
        r52CatNo: {
            type: Number,
            required: true,
            default: 0000,
        },
        r52Locale: {
            type: Array,
            default: []
        },
        r52SupplierCode: {
            type: String,
            default:0000
        },
        status: {
            type: String,
            required: true,
            default: 'Unavailable'
        },
        stock: {
            type: Object,
            default: {}
        },
        suppCatNo: {
            type: String,
            required: true,
        },
        supplier: {
            type: Object,
            default: {}
        },
        tax: {
            //////// name IS ADDED AS PER UPLOAD SHEET
            name: {
                type: String,
                default: '',
            },
            category: {
                type: String,
                default: '',
            },
            isIncluded: {
                type: Boolean,
                require: true,
                min: 6,
                default: false,
            },
            //////// IsTaxExempt IS ADDED AS PER UPLOAD SHEET
            IsTaxExempt: {
                type: Boolean,
                require: true,
                min: 6,
                default: false,
            },
            percentage: {
                type: Number,
                default: 0,
            },
            type: {
                type: String,
                default: '',
            }
        },
        type: {
            type: String,
            default: '',
        },
        usdPrice: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
module.exports = mongoose.model("products", catalougeSchema);
// {
//     "barCode": "000",
//         "brandName": {
//           "eng": "Tempra forte syrup"
//         },
//         "catalogTags": [
//           "PHL-king",
//           "PHL"
//         ],
//         "description": {
//           "eng": "Package info: 60ml"
//         },
//         "dosage": "250mg/5ml",
//         "form": {
//           "eng": "syrup"
//         },
//         "genericName": {
//           "eng": "Paracetamol"
//         },
//         "handlingInstr": {
//           "eng": ""
//         },
//         "information": {
//           "eng": ""
//         },
//         "ingredients": {
//           "eng": [
//             "Paracetamol"
//           ]
//         },
//         "isoCountry": "phl",
//         "isoCurrency": "php",
//         "medClass": [],
//         "medCode": "",
//         "metadata": {
//           "createdBy": {
//             "userId": "ryann",
//             "utcDatetime": "2021-02-02T07:00:19.749Z"
//           },
//           "updatedBy": [],
//           "version": 2
//         },
//         "packSize": 1,
//         "prescriptionRequired": false,
//         "price": 151,
//         "prodCategory": [],
//         "promotion": {
//           "eng": ""
//         },
//         "r52CatCode": "000",
//         "r52CatNo": "KING00000001",
//         "r52Locale": [],
//         "r52SupplierCode": "KING",
//         "status": "A",
//         "stock": {
//           "qty": 1
//         },
//         "suppCatNo": "000",
//         "supplier": {
//           "eng": "King Lee Pharmacy"
//         },
//         "tax": {
//           "category": "included",
//           "isIncluded": true,
//           "percentage": 0,
//           "type": "vat"
//         },
//         "type": "medication",
//         "usdPrice": 0
// }