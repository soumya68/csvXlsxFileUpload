
var mongoose = require("mongoose");
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;
var catalougeSchema = new mongoose.Schema(
    {
        _partition: {
            type: String,
            default: "101"
        },
        tags: {
            type: Array,
            default: []
        },
        isoCountry: {
            type: String,
            default: ""
        },
        isoCurrency: {
            type: String,
            default: ""
        },
        manufacturer: {
            type: String,
            default: ""
        },
        //40
        packUnit: {
            type: String,
            default: ""
        },
        stock: {
            qty: {
                type: Long,
                default: 22
            }
        },
        ////////////////////////////
        supplierCode: {
            type: String,
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
            default: 0
        },
        //requireRx IS ADDED AS PER UPLOAD SHEET
        requireRx: {
            type: String,
            default: 'No'
        },
        //pricePerPack IS ADDED AS PER UPLOAD SHEET
        pricePerPack: {
            type: mongoose.Decimal128,
            default: 0.00

        },
        price: {

            //type:  SchemaTypes.Double ,
            // default: 0.00
            // type: String,
            // default: '0.00'
            type: mongoose.Decimal128,
            default: 0.00
        },
        ////////////////////////////////////
        pointsAccumulation: {
            type: Boolean,
            required: true,
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
        //30
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
        medClass: {
            type: Array,
            default: []
        },
        medCode: {
            type: String,
            default: 0000
        },
        //20
        createdBy: {
            userId: {
                type: String,
            },
            utcDatetime: {
                type: String
            },
        },
        metaData: {
            createdBy: {
                userId: {
                    type: String,
                },
                utcDatetime: {
                    type: String
                },
            },
            updatedBy: {
                type: String,
                default: ""
            },
            version: {
                type: Long,
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
            type: String,
            required: true,
            default: '0000',
        },
        r52Locale: {
            type: Array,
            default: []
        },
        r52SupplierCode: {
            type: String,
            default: 0000
        },
        status: {
            type: String,
            required: true,
            default: 'Unavailable'
        },
        suppCatNo: {
            type: String,
            required: true,
        },
        suppliers: {
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
                type: Long,
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
        rating: {
            type: String,
            default: '',
        },
        supplierName: {
            type: String,
            default: '',
        },
        usdPrice: {
            type: Long,
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


var customeCollectionName = 'MedicationObject'
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("medication", catalougeSchema, customeCollectionName);

