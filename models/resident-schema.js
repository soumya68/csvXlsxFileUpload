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
            location: {
                type: String,
            },
            region: {
                type: String,
            },
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            postal_code: {
                type: String,
            },
            landmark: {
                type: String,
            },
            isoCountry: {
                type: String,
            },
            zip: {
                type: String,
            },
            directions: {
                type: String,
            },
            addressLine1: {
                type: String,
            },
            addressLine2: {
                type: String,
            },
            district: {
                type: String,
            },
            town: {
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
module.exports = mongoose.model("resident", residentSchema);
/// BELOW FROM MOBILE TEAM
// {
//     "title": "ResidentUser",
//     "bsonType": "object",
//     "required": [
//     "_id",
//     "_partition",
//     "quesJson",
//     "createdDate",
//     "updatedDate",
//     "createdBy",
//     "createdById",
//     "updatedBy",
//     "isSelected"
//     ],
//     "properties": {
//     "_id": {
//     "bsonType": "objectId"
//     },
//     "_partition": {
//     "bsonType": "string"
//     },
//     "firstName": {
//     "bsonType": "string"
//     },
//     "middleName": {
//     "bsonType": "string"
//     },
//     "lastName": {
//     "bsonType": "string"
//     },
//     "email": {
//     "bsonType": "string"
//     },
//     "phoneNumber": {
//     "bsonType": "string"
//     },
//     "gender": {
//     "bsonType": "string"
//     },
//     "birthDate": {
//     "bsonType": "string"
//     },
//     "maritalStatus": {
//     "bsonType": "string"
//     },
//     "age": {
//     "bsonType": "string"
//     },
//     "quesJson": {
//     "bsonType": "string"
//     },
//     "createdDate": {
//     "bsonType": "date"
//     },
//     "updatedDate": {
//     "bsonType": "date"
//     },
//     "createdBy": {
//     "bsonType": "string"
//     },
//     "createdById": {
//     "bsonType": "string"
//     },
//     "updatedBy": {
//     "bsonType": "string"
//     },
// "address": {
//     "title": "Address",
//         "bsonType": "object",
//             "required": [
//                 "addressLine1"
//             ],
//                 "properties": {
//         "location": {
//             "bsonType": "string"
//         },
//         "region": {
//             "bsonType": "string"
//         },
//         "country": {
//             "bsonType": "string"
//         },
//         "city": {
//             "bsonType": "string"
//         },
//         "postal_code": {
//             "bsonType": "string"
//         },
//         "landmark": {
//             "bsonType": "string"
//         },
//         "isoCountry": {
//             "bsonType": "string"
//         },
//         "zip": {
//             "bsonType": "string"
//         },
//         "directions": {
//             "bsonType": "string"
//         },
//         "addressLine1": {
//             "bsonType": "string"
//         },
//         "addressLine2": {
//             "bsonType": "string"
//         },
//         "district": {
//             "bsonType": "string"
//         },
//         "town": {
//             "bsonType": "string"
//         }
//     }
// },
// "ques": {
//     "bsonType": "array",
//         "items": {
//         "title": "que",
//             "bsonType": "object",
//                 "required": [
//                     "answerBoolean"
//                 ],
//                     "properties": {
//             "question": {
//                 "bsonType": "string"
//             },
//             "answerBoolean": {
//                 "bsonType": "bool"
//             },
//             "answerArray": {
//                 "bsonType": "array",
//                     "items": {
//                     "bsonType": "string"
//                 }
//             },
//             "answerString": {
//                 "bsonType": "string"
//             }
//         }
//     }
// },
// "isSelected": {
//     "bsonType": "bool"
// }
//     }
//     }
