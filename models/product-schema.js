var mongoose = require("mongoose");
const validator = require("validator");

// var productSchema = new mongoose.Schema(
//     {
//         productname: {
//             type: String,
//             required: true,
//             min: 6,
//             trim: true,
//         },
//         description: {
//             type: String,
//             min: 1,
//         },

//         price: {
//             type: String
//         },
//         quantity: {
//             type: String
//         },

//         isDiscounted: {
//             type: Boolean,
//             require: true,
//             min: 6,
//             default: false,
//         },
//         isAvailable: {
//             type: Boolean,
//             require: true,
//             min: 6,
//             default: false,
//         },

//     },
//     {
//         timestamps: {
//             createdAt: "createdAt",
//             updatedAt: "updatedAt",
//         },
//     }
// );



var productSchema = new mongoose.Schema(
    {
        catalogue_number: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },

        supplier_catalogue_number: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },

        brand_name: {
            type: String,
            // required: true,
            // min: 6,
            // trim: true,
        },
        generic: {
            type: String,
            // required: true,
            // min: 6,
            // trim: true,
        },
        manufacturer_name: {
            type: String,
            // required: true,
            // min: 6,
            // trim: true,
        },
        description: {
            type: String,
            min: 1,
        },
        dosage: {
            type: String
        },
        form: {
            type: String
        },
        pack_size: {
            type: String
        },
        pack_size_unit: {
            type: String
        },
        product_type: {
            type: String
        },
        require_rx: {
            type: String
        },
        tax_name: {
            type: String
        },
        Is_tax_exempt: {
            type: String,
            require: true,
            min: 6,
            default: false,
        },
        Is_tax_included: {
            type: String,
            require: true,
            min: 6,
            default: false,
        },
        tax_percent: {
            type: String
        },
        price_per_pack: {
            type: String
        },
        catalog_tag: {
            type: String
        },
        status: {
            type: String
        },

        isDiscounted: {
            type: Boolean,
            require: true,
            min: 6,
            default: false,
        },

    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);


module.exports = mongoose.model("product", productSchema);
