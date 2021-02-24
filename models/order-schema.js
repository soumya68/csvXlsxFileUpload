var mongoose = require("mongoose");
const validator = require("validator");
var orderSchema = new mongoose.Schema(
    {

        userId: {
            type: String,
            required: true,
        },
        productDetails: {
            type: Array,
            default: []
        },
        deliveryAddress: {
            type: String,
            //required: true,
            min: 6,
            trim: true,
        },
        finalPrice: {
            type: Number,
            default: 0
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
module.exports = mongoose.model("order", orderSchema);
