
var mongoose = require("mongoose");
const validator = require("validator");
var catalogueFileStatusSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },
        userId: {
            type: String,
            required: true,
        },
        supplierCode: {
            type: String,
            required: true,
        },
        successedRecordsCount: {
            type: Number,
            default: 0
        },
        failedRecordsCount: {
            type: Number,
            default: 0
        },
        totalRecordsCount: {
            type: Number,
            default: 0
        },
        duplicateRecordsCount: {
            type: Number,
            default: 0
        },
        status: {
            type: Boolean,
            default: false
        },
        isoCountryCode: {
            type: String,
            default: ""
        },
        // supplierId: {
        //     type: mongoose.Schema.Types.ObjectId,
        // },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

var customeCollectionName = 'CatalogueFile'
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("catalogueFiles", catalogueFileStatusSchema, customeCollectionName);