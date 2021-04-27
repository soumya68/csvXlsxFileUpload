var mongoose = require("mongoose");
const validator = require("validator");
var orderSchema = new mongoose.Schema(
    {
        _partition: {
            type: String,
            default: "101"
        },
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
        deliveryFee:{
            type: mongoose.Decimal128,
            default: 0.00
        },
        orderSubTotal: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        orderTotalPayable: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        pointBasedDiscountedAmount: {
            type: mongoose.Decimal128,
            default: 0.00
        },
        canRedeemPoints: {
            type: Boolean,
            default: false
        },
        isPointsAddedToResident: {
            type: Boolean,
            default: false
        },
        isEarnedPointCalculated: {
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
            acceptedOn: {
                type: String
            },
            effectiveDate: {
                type: String
            },
            enteredOn: {
                type: String
            },
            expiryDate: {
                type: String
            },
            processedOn: {
                type: String
            },
            status: {
                type: String
            },

        },
      
        subOrders:[],
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
module.exports = mongoose.model("order", orderSchema, 'OrderMedicine');


  // var currentStatus : CurrentStatus? = null
        // var email: String? = null
        // var isoCountry: String? = null
        // var items: RealmList<Items> = RealmList()
        // var pastStatuses: RealmList<PastStatus>? = RealmList()  //need discussed
        // var phone: String? = null
        // var r52SuppCode: String? = null
        // var subOrderID: String? = null
        // var supplierCode: String? = null
        // var supplierName: String? = null
        // var taxPayable: Decimal128? = null
        // var totalPayable: Decimal128? = null
        // var subTotal: Decimal128? = null