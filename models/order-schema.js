var mongoose = require("mongoose");
var customeCollectionName = 'OrderMedicine';

var orderSchema = new mongoose.Schema(
    {
        _partition: {
            type: String
        },
        canRedeemPoints: {
            type: Boolean,
            default: false
        },
        physicianLicenseNumber: {
            type: String
        },
        physicianId: {
            type: String
        },
        physicianName: {
            type: String
        },
        currentStatus: {
            reason: {
                type: String
            },
            reasonCode: {
                type: String,
                default: ''
            },
            status: {
                type: String
            },
            statusDate: {
                type: Date
            },
            userDisplayName: {
                type: String,
                default: ''
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            username: {
                type: String,
                default: ''
            },
        },
        deliveryFee: {
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
        isEarnedPointCalculated: {
            type: Boolean,
            default: false
        },
        isPointsAddedToResident: {
            type: Boolean,
            default: false
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
                    type: mongoose.Schema.Types.ObjectId,
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
        orderStatus: {
            type: String,
        },
        orderSubTotal: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        orderTotalPayable: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        patientAddress: {
            type: Object,
            default: {},
            addressLine1: {
                type: String,
                default: ''
            },
            isoCountry: {
                type: String,
                required: true,
            },
            isoCurrency: {
                type: String,
                required: true,
            },
            villageCode: {
                type: String,
                default: ''
            },
            zip: {
                type: String,
                default: ''
            },
        },
        patientAge: {
            type: Number,
            default: 0
        },
        patientGender: {
            type: String,
        },
        patientName: {
            type: String,
            default: 0
        },
        pointBasedDiscountedAmount: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        prescriptionImage: {
            type: String,
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
        supplierOrderId: {
            type: String,
            default: 0
        },
        taxPayable: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        trackingCode: {
            type: String,
            default: 0
        },
        type: {
            type: String,
            default: 0
        },
        subOrders: [
            {
                currentStatus: {
                    reason: {
                        type: String,
                        default: '',
                    },
                    reasonCode: {
                        type: String,
                        default: ''
                    },
                    status: {
                        type: String
                    },
                    statusDate: {
                        type: Date
                    },
                    userDisplayName: {
                        type: String,
                        default: ''
                    },
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true
                    },
                    username: {
                        type: String,
                        default: '',
                    },
                },
                items: [{
                    tax: {
                        category: {
                            type: String

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
                            default: 0.00,
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
                    brandName: {
                        type: String,
                        default: ''
                    },
                    description: {
                        type: String,
                        default: ''
                    },
                    dosage: {
                        type: String,
                        default: 0
                    },
                    form: {
                        type: Object,
                        default: {}
                    },
                    genericname: {
                        type: String,
                        default: ''
                    },
                    information: {
                        type: String,
                        default: ''
                    },
                    linesubtotal: {
                        type: mongoose.Decimal128,
                        default: 0.00
                    },
                    medicationid: {
                        type: String
                    },
                    packagesize: {
                        type: String,
                        default: 0
                    },
                    packageunit: {
                        type: Number
                    },
                    prescriptionrequired: {
                        type: Boolean,
                        require: true,
                        min: 6,
                        default: false,
                    },
                    price: {
                        type: mongoose.Decimal128,
                        default: 0.00
                    },
                    qty: {
                        type: Number
                    },
                    qtyoriginal: {
                        type: Number
                    },
                    r52suppcode: {
                        type: String
                    },
                    status: {
                        type: String,
                    },
                    statusreason: {
                        type: String
                    },
                    suppCatNo: {
                        type: String
                    },
                    supplier: {
                        type: String
                    },
                }],
                pastStatuses: [{
                    reason: {
                        type: String,
                        default: '',
                    },
                    reasonCode: {
                        type: String,
                        default: ''
                    },
                    status: {
                        type: String
                    },
                    statusDate: {
                        type: Date
                    },
                    userDisplayName: {
                        type: String,
                        default: ''
                    },
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true
                    },
                    username: {
                        type: String,
                        default: '',
                    },
                }],
                email: {
                    type: String,
                    default: ""
                },
                isoCountry: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    default: ""
                },
                r52SuppCode: {
                    type: String
                },
                subOrderID: {
                    type: String,
                },
                supplierCode: {
                    type: String
                },
                supplierName: {
                    type: String
                },
                taxPayable: {
                    type: mongoose.Decimal128,
                    default: 0.00
                },
                totalPayable: {
                    type: mongoose.Decimal128,
                    default: 0.00
                },
                subTotal: {
                    type: mongoose.Decimal128,
                    default: 0.00
                },
            }
        ],
        deliveryAddress: {
            type: String,
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
var customeCollectionName = 'OrderMedicine'
/// TO MAKE CUSTOME COLLECTION NAME
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("ordermedicine", orderSchema, customeCollectionName);