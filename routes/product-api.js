const bodyParser = require('body-parser');
const products = require('../models/catalouge-schema');
const catalogueFiles = require('../models/catalogue-file-status-schema');
const path = require('path');
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require("crypto");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
module.exports = (app, connection) => {
    app.use(bodyParser.json());
    var product_module = require('../module/product_module')();
    // File upload folder
    const DIR = 'Product_Details_Import/';
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, DIR)
        },
        filename: function (req, file, callback) {
            const randomdigit = Math.floor(Math.random() * 1000000)
            const fileName = randomdigit + file.originalname.toLowerCase().split(' ').join('-');
            callback(null, fileName)
        },
    });
    // File type validation  by multer
    var upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "text/csv"
                || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .xlsx, .csv format!'));
            }
        }
    });
    //API FOR PRODUCT DETAILS EXCELSHEET IMPORT
    //Params: file
    //Response: status, message
    app.post('/api/upload_products', upload.single('file'), function (req, res) {
        try {
            invalid_datas = [];
            incorrect_entry_count = 0;
            correct_entry_count = 0;
            total_entry_count = 0;
            if (!req.file) {
                res.json({ status: false, message: "No file passed" });
                return;
            }
            // File path where file is saved
            var filepath = path.resolve('Product_Details_Import/' + req.file.filename);
            const fileData = {
                filename: req.file.filename,
                user_id: req.body.user_id,
                status: false,
                successed_records_count: 0,
                falied_records_count: 0,
                total_records_count: 0,
                timestamp: new Date()
            };
            const fileDetails = new catalogueFiles(fileData);
            fileDetails.save().then(response => {
                //FILE DATA INSERT CODE WILL BE HERE
                if (req.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    ////// THIS IS FOR XLSX FILE 
                    product_module.xlsx_upload(filepath, correct_entry_count, invalid_datas,
                        function (error, total_entry_count, correct_entry_count, invalid_datas) {
                            if (total_entry_count == 0) {
                                return res.status(200).json({
                                    status: false,
                                    message: "File is empty",
                                    invalid_rows: invalid_datas,
                                    invalid_rows_count: invalid_datas.length,
                                    valid_rows_count: correct_entry_count,
                                    total_rows_count: total_entry_count
                                })
                            }
                            if (error) {
                                res.status(200).json({
                                    status: false,
                                    message: error,
                                    invalid_rows: invalid_datas,
                                    invalid_rows_count: invalid_datas.length,
                                    valid_rows_count: correct_entry_count,
                                    total_rows_count: total_entry_count
                                })
                            }
                            else {
                                let updates = {
                                    status: true,
                                    successed_records_count: correct_entry_count,
                                    falied_records_count: invalid_datas.length,
                                    total_records_count: total_entry_count
                                }
                                catalogueFiles.findOneAndUpdate({ filename: req.file.filename },
                                    { $set: updates },
                                    { new: true }).then(response => {
                                        if (invalid_datas.length > 0) {
                                            product_module.failuer_file_upload(req.file.filename,
                                                function (error) {
                                                    if (error) {
                                                        res.status(200).json({
                                                            status: false,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalid_datas,
                                                            invalid_rows_count: invalid_datas.length,
                                                            valid_rows_count: correct_entry_count,
                                                            total_rows_count: total_entry_count
                                                        })
                                                    }
                                                    else {
                                                        res.status(200).json({
                                                            status: true,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalid_datas,
                                                            invalid_rows_count: invalid_datas.length,
                                                            valid_rows_count: correct_entry_count,
                                                            total_rows_count: total_entry_count
                                                        })
                                                    }
                                                })
                                        }
                                        else {
                                            res.status(200).json({
                                                status: true,
                                                message: "Data Inserted Successfully",
                                                invalid_rows: invalid_datas,
                                                invalid_rows_count: invalid_datas.length,
                                                valid_rows_count: correct_entry_count,
                                                total_rows_count: total_entry_count
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        return res.status(400).json({ status: false, message: err });
                                    });
                            }
                        })
                }
                else {
                    ////// THIS IS FOR CSV FILE 
                    product_module.csv_upload(filepath, total_entry_count, correct_entry_count, invalid_datas,
                        function (error, total_entry_count, correct_entry_count, invalid_datas) {
                            if (error) {
                                res.status(200).json({
                                    status: false,
                                    message: error,
                                    invalid_rows: invalid_datas,
                                    invalid_rows_count: invalid_datas.length,
                                    valid_rows_count: correct_entry_count,
                                    total_rows_count: total_entry_count
                                })
                            }
                            else {
                                let updates = {
                                    status: true,
                                    successed_records_count: correct_entry_count,
                                    falied_records_count: invalid_datas.length,
                                    total_records_count: total_entry_count
                                }
                                catalogueFiles.findOneAndUpdate({ filename: req.file.filename },
                                    { $set: updates },
                                    { new: true }).then(response => {
                                        if (invalid_datas.length > 0) {
                                            product_module.failuer_file_upload(req.file.filename,
                                                function (error) {
                                                    if (error) {
                                                        res.status(200).json({
                                                            status: false,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalid_datas,
                                                            invalid_rows_count: invalid_datas.length,
                                                            valid_rows_count: correct_entry_count,
                                                            total_rows_count: total_entry_count
                                                        })
                                                    }
                                                    else {
                                                        res.status(200).json({
                                                            status: true,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalid_datas,
                                                            invalid_rows_count: invalid_datas.length,
                                                            valid_rows_count: correct_entry_count,
                                                            total_rows_count: total_entry_count
                                                        })
                                                    }
                                                })
                                        }
                                        else {
                                            res.status(200).json({
                                                status: true,
                                                message: "Data Inserted Successfully",
                                                invalid_rows: invalid_datas,
                                                invalid_rows_count: invalid_datas.length,
                                                valid_rows_count: correct_entry_count,
                                                total_rows_count: total_entry_count
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        return res.status(400).json({ status: false, message: err });
                                    });
                            }
                        })
                    /////////
                }
                ////
            }).catch(err => {
                return res.status(400).json({ message: 'Error while uploading file', error: err });
            });
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
};