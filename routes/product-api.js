const bodyParser = require('body-parser');
const catalogueFiles = require('../models/catalogue-file-schema');
const path = require('path');
const multer = require('multer');
module.exports = (app) => {
    var productModule = require('../module/product_module')();
    // File upload folder
    const DIR = 'Catalouge_Import/';
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, DIR)
        },
        filename: function (req, file, callback) {
            var date = new Date();
            var dateStr =
                ("00" + date.getDate()).slice(-2) + "-" +
                ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
                date.getFullYear() + "-" +
                ("00" + date.getHours()).slice(-2) + ":" +
                ("00" + date.getMinutes()).slice(-2) + ":" +
                ("00" + date.getSeconds()).slice(-2);
            if (file.mimetype == "text/csv") {
                const fileName = req.body.supplierId + req.body.isoCountryCode + dateStr + '.csv';
                callback(null, fileName)
            }
            else {
                const fileName = req.body.supplierId + req.body.isoCountryCode + dateStr + '.xlsx';
                callback(null, fileName)
            }
            const randomDigit = Math.floor(Math.random() * 1000000)
        },
    });
    // File type validation  by multer
    var upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }, // File size must be below 1 MB
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
    app.post('/api/upload/products',
        upload.single('file'),
        function (req, res) {
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
                if (!req.body.userId) {
                    res.json({ status: false, message: "userId parameter is missing" });
                    return;
                }
                if (!req.body.supplierId) {
                    res.json({ status: false, message: "supplierId parameter is missing" });
                    return;
                }
                // File path where file is saved
                var filePath = path.resolve(DIR + req.file.filename);
                var userId = req.body.userId;
                var version = req.body.version;
                var supplierId = req.body.supplierId
                const fileData = {
                    fileName: req.file.filename,
                    userId: userId,
                    status: false,
                    successedRecordsCount: 0,
                    failedRecordsCount: 0,
                    totalRecordsCount: 0,
                    timestamp: new Date()
                };
                const fileDetails = new catalogueFiles(fileData);
                fileDetails.save().then(response => {
                    //FILE DATA INSERT CODE WILL BE HERE
                    if (req.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                        ////// THIS IS FOR XLSX FILE 
                        productModule.xlsxUpload(userId, version, supplierId, filePath, correctEntryCount, invalidDatas, duplicateEntryCount,
                            function (error, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount) {
                                if (totalEntryCount == 0) {
                                    return res.status(200).json({
                                        status: false,
                                        message: "File is empty",
                                        invalidRows: invalidDatas,
                                        invalidRowsCount: invalidDatas.length,
                                        validRowsCount: correctEntryCount,
                                        totalRowsCount: totalEntryCount,
                                        duplicateEntryCount: duplicateEntryCount
                                    })
                                }
                                if (error) {
                                    res.status(200).json({
                                        status: false,
                                        message: error,
                                        invalidRows: invalidDatas,
                                        invalidRowsCount: invalidDatas.length,
                                        validRowsCount: correctEntryCount,
                                        totalRowsCount: totalEntryCount,
                                        duplicateEntryCount: duplicateEntryCount
                                    })
                                }
                                else {
                                    let updates = {
                                        status: true,
                                        successedRecordsCount: correctEntryCount,
                                        failedRecordsCount: invalidDatas.length,
                                        totalRecordsCount: totalEntryCount,
                                        duplicateRecordsCount: duplicateEntryCount
                                    }
                                    catalogueFiles.findOneAndUpdate({ fileName: req.file.filename },
                                        { $set: updates },
                                        { new: true }).then(response => {
                                            if (invalidDatas.length > 0) {
                                                productModule.failuerFileUpload(req.file.filename, invalidDatas,
                                                    function (error) {
                                                        if (error) {
                                                            res.status(200).json({
                                                                status: false,
                                                                invalidRows: invalidDatas,
                                                                invalidRowsCount: invalidDatas.length,
                                                                validRowsCount: correctEntryCount,
                                                                totalRowsCount: totalEntryCount,
                                                                duplicateEntryCount: duplicateEntryCount
                                                            })
                                                        }
                                                        else {
                                                            res.status(200).json({
                                                                status: true,
                                                                message: "Data Inserted Successfully",
                                                                invalidRows: invalidDatas,
                                                                invalidRowsCount: invalidDatas.length,
                                                                validRowsCount: correctEntryCount,
                                                                totalRowsCount: totalEntryCount,
                                                                duplicateEntryCount: duplicateEntryCount
                                                            })
                                                        }
                                                    })
                                            }
                                            else {
                                                res.status(200).json({
                                                    status: true,
                                                    message: "Data Inserted Successfully",
                                                    invalidRows: invalidDatas,
                                                    invalidRowsCount: invalidDatas.length,
                                                    validRowsCount: correctEntryCount,
                                                    totalRowsCount: totalEntryCount,
                                                    duplicateEntryCount: duplicateEntryCount
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
                        productModule.csvUpload(userId, version, supplierId, filePath, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount,
                            function (error, totalEntryCount, correctEntryCount, invalidDatas, duplicateEntryCount) {
                                if (error) {
                                    res.status(200).json({
                                        status: false,
                                        message: error,
                                        invalidRows: invalidDatas,
                                        invalidRowsCount: invalidDatas.length,
                                        validRowsCount: correctEntryCount,
                                        totalRowsCount: totalEntryCount,
                                        duplicateEntryCount: duplicateEntryCount
                                    })
                                }
                                else {
                                    let updates = {
                                        status: true,
                                        successedRecordsCount: correctEntryCount,
                                        failedRecordsCount: invalidDatas.length,
                                        totalRecordsCount: totalEntryCount,
                                        duplicateRecordsCount: duplicateEntryCount
                                    }
                                    catalogueFiles.findOneAndUpdate({ fileName: req.file.filename },
                                        { $set: updates },
                                        { new: true }).then(response => {
                                            if (invalidDatas.length > 0) {
                                                productModule.failuerFileUpload(req.file.filename, invalidDatas,
                                                    function (error) {
                                                        if (error) {
                                                            res.status(200).json({
                                                                status: false,
                                                                message: "Data Inserted Successfully",
                                                                invalidRows: invalidDatas,
                                                                invalidRowsCount: invalidDatas.length,
                                                                validRowsCount: correctEntryCount,
                                                                totalRowsCount: totalEntryCount,
                                                                duplicateEntryCount: duplicateEntryCount
                                                            })
                                                        }
                                                        else {
                                                            res.status(200).json({
                                                                status: true,
                                                                message: "Data Inserted Successfully",
                                                                invalidRows: invalidDatas,
                                                                invalidRowsCount: invalidDatas.length,
                                                                validRowsCount: correctEntryCount,
                                                                totalRowsCount: totalEntryCount,
                                                                duplicateEntryCount: duplicateEntryCount
                                                            })
                                                        }
                                                    })
                                            }
                                            else {
                                                res.status(200).json({
                                                    status: true,
                                                    message: "Data Inserted Successfully",
                                                    invalidRows: invalidDatas,
                                                    invalidRowsCount: invalidDatas.length,
                                                    validRowsCount: correctEntryCount,
                                                    totalRowsCount: totalEntryCount,
                                                    duplicateEntryCount: duplicateEntryCount
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
    //END OF API FOR PRODUCT DETAILS EXCELSHEET IMPORT
};