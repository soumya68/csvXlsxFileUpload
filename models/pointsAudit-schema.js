var mongoose = require("mongoose");
const validator = require("validator");
var pointsAuditSchema = new mongoose.Schema(
    {

        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
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
        availablePoints: {
            type: Number,
            default: 0
        },
        pointSource: {
            type: Array,
            default: []
        },
        isActive: {
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
module.exports = mongoose.model("pointsAudit", pointsAuditSchema);
