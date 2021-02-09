bodyParser = require('body-parser');
const productSchema = require('../models/product-schema');
const path = require('path');
var multer = require('multer');
var readXlsxFile = require('read-excel-file/node');
var fs = require('fs');
var crypto = require("crypto");
module.exports = (app, connection) => {
    app.use(bodyParser.json());
    // Destination where excelsheet will be stored
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'Product_Details_Import/')
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
        // fileFilter: function (req, file, callback) { //file filter
        //     if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
        //         return callback(new Error('Wrong extension type'));
        //     }
        //     callback(null, true);
        // }
    });
    var upload = multer({ storage: storage });//this is the key
    //API FOR PRODUCT DETAILS IMPORT
    //Params: user-token,file
    //Response: status, message
    app.post('/api/upload_products', upload.single('file'), function (req, res) {
        try {
            if (!req.file) {
                res.json({ status: false, message: "No file passed" });
                return;
            }
            var filepath = path.resolve('Product_Details_Import/NewCatalogueTemplate_0-3.xlsx');
            console.log(filepath)
            readXlsxFile(fs.createReadStream(filepath),{sheet:2}).then((rows) => {
                var theRemovedElement = rows.shift();
                console.log('A')
                if (rows.length !== 0) {
                    console.log('A1')
                    var index = 0;
                    var insert_data = function (doc) {
                        console.log('A2')
                        console.log(doc)
                        // if (doc.length !== 0) {
                            const productData = {
                                catalogue_number: crypto.randomBytes(6).toString('hex'),
                                supplier_catalogue_number: crypto.randomBytes(5).toString('hex'),
                                brand_name: doc[2],
                                generic: doc[3],
                                manufacturer_name: doc[4],
                                description: doc[5],
                                dosage: doc[6],
                                form: doc[7],
                                pack_size: doc[8],
                                pack_size_unit: doc[9],
                                product_type: doc[10],
                                require_rx: doc[11],
                                tax_name: doc[12],
                                Is_tax_exempt: doc[13],
                                Is_tax_included: doc[14],
                                tax_percent: doc[15],
                                price_per_pack: doc[16],
                                catalog_tag: doc[17],
                                status: doc[18],
                                isDiscounted: doc[19],
                                timestamp: new Date()
                            };
                            const product = new productSchema(productData);
                            product.save().then(response => {
                                index++;
                                if (index < rows.length) {
                                    insert_data(rows[index]);
                                } else {
                                    res.json({ status: true, message: "Data Inserted Successfully" });
                                }
                            }).catch(err => {
                                return res.status(400).json({ message: 'Error while creating product', error: err });
                            });
                        // }
                        // else {
                        //     index++;
                        //     if (index < rows.length) {
                        //         insert_data(rows[index]);
                        //     } else {
                        //         res.json({ status: true, message: "Data Inserted Successfully" });
                        //     }
                        // }
                    }
                    if (rows.length !== 0) {
                        insert_data(rows[index]);
                    }
                }
                else {
                    res.json({ status: false, message: "File is Empty" });;
                }
            })
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
};