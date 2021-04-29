var mongoose = require("mongoose");
const validator = require("validator");
const autoIncrement = require('mongoose-auto-increment');
var residentSchema = new mongoose.Schema(
    {
        _partition: {
            type: String,
            default: "101"
        },
        firstName: {
            type: String,
            default: null
        },
        middleName: {
            type: String,
            default: null
        },
        lastName: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        phoneNumber: {
            type: String,
            default: null
        },
        gender: {
            type: String,
            default: null
        },
        birthDate: {
            type: String,
            default: null
        },
        maritalStatus: {
            type: String,
            default: null
        },
        age: {
            type: String,
            default: null
        },
        quesJson: {
            type: String,
            default: null
        },
        createdDate: {
            type: Date,
        },
        updatedDate: {
            type: Date,
        },
        createdBy: {
            type: String,
        },
        createdBy: {
            userId: {
                type: String,
                required: true
            },
            utcDatetime: {
                type: Date
            },
        },
        createdById: {
            type: String,
        },
        updatedBy: {
            type: String,
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        address: {
            addressLine1: {
                type: String,
            },
            addressLine2: {
                type: String,
            },
            city: {
                type: String,
            },
            country: {
                type: String,
            },
            district: {
                type: String,
            },
            isoCountry: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            directions: {
                type: String,
            },
            landmark: {
                type: String,
            },
            region: {
                type: String,
            },
            town: {
                type: String,
            },
            zip: {
                type: String,
            }
        },
        ques: {
            type: Array,
            default: []
        },
        availablePoints: {
            type: Number,
            default: 0
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
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
);
var customeCollectionName = 'ResidentUser'
/// TO MAKE CUSTOME COLLECTION NAME
module.exports = mongoose.model("resident", residentSchema, customeCollectionName);
