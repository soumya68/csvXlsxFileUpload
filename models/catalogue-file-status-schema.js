var mongoose = require("mongoose");
const validator = require("validator");
var catalogueFileStatusSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        successed_records_count: {
            type: Number
        },
        falied_records_count: {
            type: Number
        },
        total_records_count: {
            type: Number
        },
        duplicate_records_count: {
            type: Number
        },
        status: {
            type: Boolean
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
module.exports = mongoose.model("catalogueFiles", catalogueFileStatusSchema);
