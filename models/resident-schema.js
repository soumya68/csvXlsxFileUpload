var mongoose = require("mongoose");
const validator = require("validator");
const autoIncrement = require('mongoose-auto-increment');
var residentSchema = new mongoose.Schema(
    {
        residentId: {
            type: String,
            required: true
        },
        availablePoints: {
            type: Number,
            default: 0
        },
        metadata: {
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
                type: Array,
                default: []
            },
            version: {
                type: String,
                default: 0
            },
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
// autoIncrement.initialize(mongoose.connection);
// residentSchema.plugin(autoIncrement.plugin, {
//     model: 'resident',
//     field: 'residentId',
//     startAt: 10000000,
//     incrementBy: 1
// });
module.exports = mongoose.model("resident", residentSchema);
