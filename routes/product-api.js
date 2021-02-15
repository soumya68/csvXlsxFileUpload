const bodyParser = require('body-parser');
const catalogueFiles = require('../models/catalogue-file-status-schema');
const path = require('path');
const multer = require('multer');

module.exports = (app, connection) => {
    app.use(bodyParser.json());
    var productModule = require('../module/product_module')();
    // File upload folder
    const DIR = 'Catalouge_Import/';
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, DIR)
        },
        filename: function (req, file, callback) {
            const randomDigit = Math.floor(Math.random() * 1000000)
            const fileName = randomDigit + file.originalname.toLowerCase().split(' ').join('-');
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
    //START OF API FOR PRODUCT DETAILS EXCELSHEET IMPORT
    //Params: file
    //Response: status, message
    app.post('/api/upload_products', upload.single('file'), function (req, res) {
        try {
            invalidDatas = [];
            incorrectEntryCount = 0;
            correctEntryCount = 0;
            totalEntryCount = 0;
            duplicateEntryCount = 0;
            if (!req.file) {
                res.json({ status: false, message: "No file passed" });
                return;
            }
            if (!req.body.user_id) {
                res.json({ status: false, message: "No user_id passed" });
                return;
            }
            if (!req.body.supplier_id) {
                res.json({ status: false, message: "No supplier_id passed" });
                return;
            }
            // File path where file is saved
            var filePath = path.resolve(DIR + req.file.filename);
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
                    productModule.xlsxUpload(req.body.supplier_id,filePath, correctEntryCount, invalidDatas, duplicateEntryCount,
                        function (error, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount) {
                            if (totalEntryCount == 0) {
                                return res.status(200).json({
                                    status: false,
                                    message: "File is empty",
                                    invalid_rows: invalidDatas,
                                    invalid_rows_count: invalidDatas.length,
                                    valid_rows_count: correctEntryCount,
                                    total_rows_count: totalEntryCount
                                })
                            }
                            if (error) {
                                res.status(200).json({
                                    status: false,
                                    message: error,
                                    invalid_rows: invalidDatas,
                                    invalid_rows_count: invalidDatas.length,
                                    valid_rows_count: correctEntryCount,
                                    total_rows_count: totalEntryCount
                                })
                            }
                            else {
                                let updates = {
                                    status: true,
                                    successed_records_count: correctEntryCount,
                                    falied_records_count: invalidDatas.length,
                                    total_records_count: totalEntryCount,
                                    duplicate_records_count: duplicateEntryCount
                                }
                                catalogueFiles.findOneAndUpdate({ filename: req.file.filename },
                                    { $set: updates },
                                    { new: true }).then(response => {
                                        if (invalidDatas.length > 0) {
                                            productModule.failuerFileUpload(req.file.filename,
                                                function (error) {
                                                    if (error) {
                                                        res.status(200).json({
                                                            status: false,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalidDatas,
                                                            invalid_rows_count: invalidDatas.length,
                                                            valid_rows_count: correctEntryCount,
                                                            total_rows_count: totalEntryCount,
                                                            duplicate_entry_count: duplicateEntryCount
                                                        })
                                                    }
                                                    else {
                                                        res.status(200).json({
                                                            status: true,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalidDatas,
                                                            invalid_rows_count: invalidDatas.length,
                                                            valid_rows_count: correctEntryCount,
                                                            total_rows_count: totalEntryCount,
                                                            duplicate_entry_count: duplicateEntryCount
                                                        })
                                                    }
                                                })
                                        }
                                        else {
                                            res.status(200).json({
                                                status: true,
                                                message: "Data Inserted Successfully",
                                                invalid_rows: invalidDatas,
                                                invalid_rows_count: invalidDatas.length,
                                                valid_rows_count: correctEntryCount,
                                                total_rows_count: totalEntryCount,
                                                duplicate_entry_count: duplicateEntryCount
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
                    productModule.csvUpload(req.body.supplier_id,filePath, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount,
                        function (error, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount) {
                            if (error) {
                                res.status(200).json({
                                    status: false,
                                    message: error,
                                    invalid_rows: invalidDatas,
                                    invalid_rows_count: invalidDatas.length,
                                    valid_rows_count: correctEntryCount,
                                    total_rows_count: totalEntryCount,
                                    duplicate_entry_count: duplicateEntryCount
                                })
                            }
                            else {
                                let updates = {
                                    status: true,
                                    successed_records_count: correctEntryCount,
                                    falied_records_count: invalidDatas.length,
                                    total_records_count: totalEntryCount,
                                    duplicate_records_count: duplicateEntryCount
                                }
                                catalogueFiles.findOneAndUpdate({ filename: req.file.filename },
                                    { $set: updates },
                                    { new: true }).then(response => {
                                        if (invalidDatas.length > 0) {
                                            productModule.failuerFileUpload(req.file.filename,
                                                function (error) {
                                                    if (error) {
                                                        res.status(200).json({
                                                            status: false,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalidDatas,
                                                            invalid_rows_count: invalidDatas.length,
                                                            valid_rows_count: correctEntryCount,
                                                            total_rows_count: totalEntryCount,
                                                            duplicate_entry_count: duplicateEntryCount
                                                        })
                                                    }
                                                    else {
                                                        res.status(200).json({
                                                            status: true,
                                                            message: "Data Inserted Successfully",
                                                            invalid_rows: invalidDatas,
                                                            invalid_rows_count: invalidDatas.length,
                                                            valid_rows_count: correctEntryCount,
                                                            total_rows_count: totalEntryCount,
                                                            duplicate_entry_count: duplicateEntryCount
                                                        })
                                                    }
                                                })
                                        }
                                        else {
                                            res.status(200).json({
                                                status: true,
                                                message: "Data Inserted Successfully",
                                                invalid_rows: invalidDatas,
                                                invalid_rows_count: invalidDatas.length,
                                                valid_rows_count: correctEntryCount,
                                                total_rows_count: totalEntryCount,
                                                duplicate_entry_count: duplicateEntryCount
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
                console.log(err)
                return res.status(400).json({ message: 'Error while uploading file', error: err });
            });
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR PRODUCT DETAILS EXCELSHEET IMPORT
};