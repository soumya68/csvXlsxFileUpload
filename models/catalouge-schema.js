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
        },
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
        supplierCode: {
            type: String,
            required: true,
        },
        //manufacturerName IS ADDED AS PER UPLOAD SHEET
        manufacturerName: {
            type: String,
            required: false,
            min: 6,
            trim: true,
        },

        packSizeUnit: {
            type: String,
            default: '0'
        },

        requireRx: {
            type: String,
            default: 'No'
        },

        pricePerPack: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        price: {
            type: mongoose.Decimal128,
            default: 0.00
        },

        pointsAccumulation: {
            type: Boolean,
            required: true,
            min: 6,
            default: false,
        },
        barCode: {
            type: String,
            default: '0000'
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
            default: '0'
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
            default: '0000'
        },
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
                    required: true
                },
                utcDatetime: {
                    type: Date
                },
            },
            updatedBy: {
                type: String,
            },
            version: {
                type: Number,
                default: 0
            },
        },
        packSize: {
            type: String,
            default: '0'
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
            default: '0000',
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
        tax: {

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

            IsTaxExempt: {
                type: Boolean,
                require: true,
                min: 6,
                default: false,
            },
            percentage: {
                type: mongoose.Decimal128,
                default: 0.00
            },
            type: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            },
        },
        type: {
            type: String,
            default: 'Medication',
        },
        rating: {
            type: String,
            default: '',
        },
        supplierName: {
            eng: {
                type: String
            }
        },
        usdPrice: {
            type: mongoose.Decimal128,
            default: 0.00
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
