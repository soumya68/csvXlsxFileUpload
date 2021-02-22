var mongoose = require("mongoose");
const validator = require("validator");
var pointSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        redeemedPoints: {
            type: Number,
            default: 0
        },
        earnedPoints: {
            type: Number,
            default: 0
        },
        earnedPointsExpiryDate: {
            type: Date,
        },
        redeemedPoints: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
module.exports = mongoose.model("point", pointSchema);
