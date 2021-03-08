const products = require('../models/catalouge-schema');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require("crypto");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { notDeepEqual } = require('assert');
module.exports = function () {
    var productModule = {
        // Start Generating catalogue number -----
        catalogueNumber: function (callBack) {
            try {
                products.find().sort({ r52CatNo: -1 }).limit(1).then((data) => {
                    if (data.length > 0) {
                        var dbNum = data[0].r52CatNo;
                        var r52CatNumber = dbNum + 1;
                        callBack(r52CatNumber);
                    }
                    else {
                        var r52CatNumber = 1000;
                        callBack(r52CatNumber);
                    }
                }).catch(err => {
                    callBack(null);
                });
            } catch (e) {
                callBack(null);
            }
        },
        // End Generating catalogue number -----
        //Start of Validation
        excelValidation: function (data, callBack) {
            try {
                console.log(data.SupplierUniqueCatalogueNumber)
                if (
                    !data.SupplierUniqueCatalogueNumber
                    || !data.BrandName
                    || !data.Dosage
                    || !data.BrandName
                    || !data.PackSize
                    || !data.PackSizeUnits
                    || !data.ProductType
                    || !data.RequiresRx
                    || !data.TaxName
                    || !data.IsTaxExempt
                    || !data.IsTaxIncluded
                    || !data.TaxPercent
                    || !data.PricePerPackage
                    || !data.Status
                    || !data.PointsAccumulation.toString()
                    || !data.Manufacturer
                ) {
                    callBack(false);
                }
                else {
                    callBack(true);
                }
            } catch (e) {
                callBack(null);
            }
        },
        //End of Validation
        // Start of Check duplicate data 
        checkDuplicate: function (SupplierUniqueCatalogueNumber, supplierCode, callBack) {
            try {
                products.findOne({ suppCatNo: SupplierUniqueCatalogueNumber, supplierCode: supplierCode }, function (err, doc) {
                    if (err) {
                        callBack(true, null);
                    }
                    if (doc) {
                        callBack(false, true);
                    }
                    else {
                        callBack(false, false);
                    }
                });
            } catch (e) {
                callBack(true, null);
            }
        },
        // End of Check duplicate data 
        // Start of csv file upload
        csvUpload: function (userId, version, supplierCode, filepath, totalEntryCount, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                var isIncluded
                var IsTaxExempt
                // var r52CatNo = crypto.randomBytes(6).toString('hex')
                var r52CatNo;
                rows = []
                rawDocuments = []
                fs.createReadStream(filepath)
                    .pipe(csv())
                    .on('data', (rowData) => {
                        rows.push(rowData)
                    })
                    .on('end', () => {
                        if (rows.length !== 0) {
                            productModule.catalogueNumber(function (result) {
                                r52CatNo = result
                                var index = 0;
                                var insertData = function (row) {
                                    productModule.excelValidation(row, function (status) {
                                        if (status) {
                                            /// DUPLICATE SUPPLIER CATALOUGE NUMBER CHECK
                                            productModule.checkDuplicate(row.SupplierUniqueCatalogueNumber, supplierCode, function (error, isDuplicate) {
                                                if (!isDuplicate) {
                                                    correctEntryCount = correctEntryCount + 1
                                                    if (row.IsTaxIncluded == 'Yes' || row.IsTaxIncluded == 1) {
                                                        isIncluded = true
                                                    }
                                                    else {
                                                        isIncluded = false
                                                    }
                                                    if (row.IsTaxExempt == 'Yes' || row.IsTaxExempt == 1) {
                                                        IsTaxExempt = true
                                                    }
                                                    else {
                                                        IsTaxExempt = false
                                                    }
                                                    const productData = {
                                                        supplierCode: supplierCode,
                                                        r52CatNo: r52CatNo,
                                                        suppCatNo: row.SupplierUniqueCatalogueNumber,
                                                        brandName: {
                                                            eng: row.BrandName,
                                                        },
                                                        genericName: {
                                                            eng: row.Generic
                                                        },
                                                        manufacturerName: row.Manufacturer,
                                                        description: {
                                                            eng: row.Description,
                                                        },
                                                        dosage: row.Dosage,
                                                        form: {
                                                            eng: row.Form,
                                                        },
                                                        packSize: row.PackSize,
                                                        packSizeUnit: row.PackSizeUnits,
                                                        type: row.ProductType,
                                                        requireRx: row.RequiresRx,
                                                        tax: {
                                                            name: row.TaxName,
                                                            category: row.TaxName,
                                                            isIncluded: isIncluded,
                                                            percentage: row.TaxPercent,
                                                            type: row.TaxName,
                                                            IsTaxExempt: IsTaxExempt
                                                        },
                                                        pricePerPack: row.PricePerPackage,
                                                        catalogTags: [row.CatalogTag],
                                                        status: row.Status,
                                                        pointsAccumulation: row.PointsAccumulation,
                                                        metadata: {
                                                            createdBy: {
                                                                userId: userId,
                                                                utcDatetime: new Date()
                                                            },
                                                            updatedBy: [],
                                                            version: version
                                                        },
                                                        timestamp: new Date(),
                                                    };
                                                    rawDocuments.push(productData)
                                                    r52CatNo = r52CatNo + 1
                                                    //////////
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        products.insertMany(rawDocuments)
                                                            .then(function (mongooseDocuments) {
                                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            })
                                                            .catch(function (err) {
                                                                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            });
                                                    }
                                                }
                                                else {
                                                    const productUpdateData = {
                                                        brandName: {
                                                            eng: row.BrandName,
                                                        },
                                                        genericName: {
                                                            eng: row.Generic
                                                        },
                                                        manufacturerName: row.Manufacturer,
                                                        description: {
                                                            eng: row.Description,
                                                        },
                                                        dosage: row.Dosage,
                                                        form: {
                                                            eng: row.Form,
                                                        },
                                                        packSize: row.PackSize,
                                                        packSizeUnit: row.PackSizeUnits,
                                                        type: row.ProductType,
                                                        requireRx: row.RequiresRx,
                                                        tax: {
                                                            name: row.TaxName,
                                                            category: row.TaxName,
                                                            isIncluded: isIncluded,
                                                            percentage: row.TaxPercent,
                                                            type: row.TaxName,
                                                            IsTaxExempt: IsTaxExempt
                                                        },
                                                        pricePerPack: row.PricePerPackage,
                                                        catalogTags: [row.CatalogTag],
                                                        status: row.Status,
                                                        pointsAccumulation: row.PointsAccumulation,
                                                        metadata: {
                                                            createdBy: {
                                                                userId: userId,
                                                                utcDatetime: new Date()
                                                            },
                                                            updatedBy: [],
                                                            version: version
                                                        },
                                                        timestamp: new Date(),
                                                    };
                                                    products.findOneAndUpdate({ suppCatNo: row.SupplierUniqueCatalogueNumber, supplierCode: supplierCode },
                                                        { $set: productUpdateData },
                                                        { new: true }).then(result => {
                                                        }).catch(err => {
                                                            console.log('error', err)
                                                        });
                                                    duplicateData = duplicateData + 1
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        products.insertMany(rawDocuments)
                                                            .then(function (mongooseDocuments) {
                                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            })
                                                            .catch(function (err) {
                                                                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            });
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            /////// IF ANY ISSUE FOUND
                                            var invaliRow = row
                                            invalidDatas.push(row)
                                            index++;
                                            if (index < rows.length) {
                                                insertData(rows[index]);
                                            } else {
                                                products.insertMany(rawDocuments)
                                                    .then(function (mongooseDocuments) {
                                                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    })
                                                    .catch(function (err) {
                                                        callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    });
                                            }
                                        }
                                    })
                                }
                                if (rows.length !== 0) {
                                    insertData(rows[index]);
                                }
                            })
                        }
                        else {
                            callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                        }
                    })
            } catch (e) {
                callBack(true, totalEntryCount, correctEntryCount, invalidDatas, duplicateData);
            }
        },
        // End of csv file upload
        // Start of xlsx file upload
        xlsxUpload: function (userId, version, supplierCode, filepath, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                var isIncluded
                var IsTaxExempt
                var r52CatNo = 0
                rawDocuments = []
                readXlsxFile(fs.createReadStream(filepath), { sheet: 2 }).then((rows) => {
                    var theRemovedElement = rows.shift();
                    if (rows.length !== 0) {
                        var index = 0;
                        productModule.catalogueNumber(function (result) {
                            r52CatNo = result
                            var insertData = function (doc) {
                                if (doc.length !== 0) {
                                    const data = {
                                        SupplierUniqueCatalogueNumber: doc[1],
                                        BrandName: doc[2],
                                        Generic: doc[3],
                                        Manufacturer: doc[4],
                                        Description: doc[5],
                                        Dosage: doc[6],
                                        Form: doc[7],
                                        PackSize: doc[8],
                                        PackSizeUnits: doc[9],
                                        ProductType: doc[10],
                                        RequiresRx: doc[11],
                                        TaxName: doc[12],
                                        IsTaxExempt: doc[13],
                                        IsTaxIncluded: doc[14],
                                        TaxPercent: doc[15],
                                        PricePerPackage: doc[16],
                                        CatalogTag: doc[17],
                                        Status: doc[18],
                                        PointsAccumulation: doc[19],
                                        supplierCode: supplierCode,
                                    };
                                    productModule.excelValidation(data, function (status) {
                                        if (status) {
                                            /// DUPLICATE SUPPLIER CATALOUGE NUMBER CHECK
                                            productModule.checkDuplicate(data.SupplierUniqueCatalogueNumber, data.supplierCode, function (error, isDuplicate) {
                                                if (!isDuplicate) {
                                                    correctEntryCount = correctEntryCount + 1
                                                    if (doc[14] == 'Yes' || doc[14] == 1) {
                                                        isIncluded = true
                                                    }
                                                    else {
                                                        isIncluded = false
                                                    }
                                                    if (doc[13] == 'Yes' || doc[14] == 1) {
                                                        IsTaxExempt = true
                                                    }
                                                    else {
                                                        IsTaxExempt = false
                                                    }
                                                    const productData = {
                                                        supplierCode: supplierCode,
                                                        r52CatNo: r52CatNo,
                                                        suppCatNo: doc[1],
                                                        brandName: {
                                                            eng: doc[2]
                                                        },
                                                        genericName: {
                                                            eng: doc[3]
                                                        },
                                                        manufacturerName: doc[4],
                                                        description: {
                                                            eng: doc[5]
                                                        },
                                                        dosage: doc[6],
                                                        form: {
                                                            eng: doc[7]
                                                        },
                                                        packSize: doc[8],
                                                        packSizeUnit: doc[9],
                                                        type: doc[10],
                                                        requireRx: doc[11],
                                                        tax: {
                                                            name: doc[12],
                                                            category: doc[12],
                                                            isIncluded: isIncluded,
                                                            percentage: doc[15],
                                                            type: doc[12],
                                                            IsTaxExempt: IsTaxExempt
                                                        },
                                                        pricePerPack: doc[16],
                                                        catalogTags: [doc[17]],
                                                        status: doc[18],
                                                        pointsAccumulation: doc[19],
                                                        metadata: {
                                                            createdBy: {
                                                                userId: userId,
                                                                utcDatetime: new Date()
                                                            },
                                                            updatedBy: [],
                                                            version: version
                                                        },
                                                        timestamp: new Date(),
                                                    };
                                                    rawDocuments.push(productData)
                                                    r52CatNo = r52CatNo + 1
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        products.insertMany(rawDocuments)
                                                            .then(function (mongooseDocuments) {
                                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            })
                                                            .catch(function (err) {
                                                                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            });
                                                    }
                                                    //////////
                                                }
                                                else {
                                                    const productUpdateData = {
                                                        brandName: {
                                                            eng: doc[2]
                                                        },
                                                        genericName: {
                                                            eng: doc[3]
                                                        },
                                                        manufacturerName: doc[4],
                                                        description: {
                                                            eng: doc[5]
                                                        },
                                                        dosage: doc[6],
                                                        form: {
                                                            eng: doc[7]
                                                        },
                                                        packSize: doc[8],
                                                        packSizeUnit: doc[9],
                                                        type: doc[10],
                                                        requireRx: doc[11],
                                                        tax: {
                                                            name: doc[12],
                                                            category: doc[12],
                                                            isIncluded: isIncluded,
                                                            percentage: doc[15],
                                                            type: doc[12],
                                                            IsTaxExempt: IsTaxExempt
                                                        },
                                                        pricePerPack: doc[16],
                                                        catalogTags: [doc[17]],
                                                        status: doc[18],
                                                        pointsAccumulation: doc[19],
                                                        metadata: {
                                                            updatedBy: [],
                                                            version: version
                                                        },
                                                        timestamp: new Date(),
                                                    };
                                                    products.findOneAndUpdate({ suppCatNo: data.SupplierUniqueCatalogueNumber, supplierCode: supplierCode },
                                                        { $set: productUpdateData },
                                                        { new: true }).then(result => {
                                                        }).catch(err => {
                                                            console.log('error', error)
                                                        });
                                                    duplicateData = duplicateData + 1
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        products.insertMany(rawDocuments)
                                                            .then(function (mongooseDocuments) {
                                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            })
                                                            .catch(function (err) {
                                                                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                            });
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            /////// IF ANY ISSUE FOUND
                                            const invalidData = {
                                                CatalougeNumber: "",
                                                SupplierUniqueCatalogueNumber: doc[1],
                                                BrandName: doc[2],
                                                Generic: doc[3],
                                                Manufacturer: doc[4],
                                                Description: doc[5],
                                                Dosage: doc[6],
                                                Form: doc[7],
                                                PackSize: doc[8],
                                                PackSizeUnits: doc[9],
                                                ProductType: doc[10],
                                                RequiresRx: doc[11],
                                                TaxName: doc[12],
                                                IsTaxExempt: doc[13],
                                                IsTaxIncluded: doc[14],
                                                TaxPercent: doc[15],
                                                PricePerPackage: doc[16],
                                                CatalogTag: doc[17],
                                                Status: doc[18],
                                                pointsAccumulation: doc[19],
                                                SupplierName: doc[20]
                                            };
                                            invalidDatas.push(invalidData)
                                            index++;
                                            if (index < rows.length) {
                                                insertData(rows[index]);
                                            }
                                            else {
                                                products.insertMany(rawDocuments)
                                                    .then(function (mongooseDocuments) {
                                                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    })
                                                    .catch(function (err) {
                                                        callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    });
                                            }
                                        }
                                    })
                                }
                                else {
                                    index++;
                                    if (index < rows.length) {
                                        insertData(rows[index]);
                                    }
                                    else {
                                        products.insertMany(rawDocuments)
                                            .then(function (mongooseDocuments) {
                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                            })
                                            .catch(function (err) {
                                                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                            });
                                    }
                                }
                            }
                            if (rows.length !== 0) {
                                insertData(rows[index]);
                            }
                        })
                    }
                    else {
                        callBack(false, 0, correctEntryCount, invalidDatas, duplicateData);
                    }
                })
                    .catch(err => {
                        callBack(true, 0, correctEntryCount, invalidDatas, duplicateData);
                    })
            } catch (e) {
                callBack(true, 0, correctEntryCount, invalidDatas, duplicateData);
            }
        },
        // End of xlsx file upload
        // Start of Failuer data file create
        failuerFileUpload: function (filename, invalidDatas, callBack) {
            try {
                const csvWriter = createCsvWriter({
                    path: 'Failure_Catalogue/' + filename,
                    header: [
                        { id: 'CatalougeNumber', title: 'CatalougeNumber' },
                        { id: 'SupplierUniqueCatalogueNumber', title: 'SupplierUniqueCatalogueNumber' },
                        { id: 'BrandName', title: 'BrandName' },
                        { id: 'Generic', title: 'Generic' },
                        { id: 'Manufacturer', title: 'Manufacturer' },
                        { id: 'Description', title: 'Description' },
                        { id: 'Dosage', title: 'Dosage' },
                        { id: 'Form', title: 'Form' },
                        { id: 'PackSize', title: 'PackSize' },
                        { id: 'PackSizeUnits', title: 'PackSizeUnits' },
                        { id: 'ProductType', title: 'ProductType' },
                        { id: 'RequiresRx', title: 'RequiresRx' },
                        { id: 'TaxName', title: 'TaxName' },
                        { id: 'IsTaxExempt', title: 'IsTaxExempt' },
                        { id: 'IsTaxIncluded', title: 'IsTaxIncluded' },
                        { id: 'TaxPercent', title: 'TaxPercent' },
                        { id: 'PricePerPackage', title: 'PricePerPackage' },
                        { id: 'CatalogTag', title: 'CatalogTag' },
                        { id: 'Status', title: 'Status' },
                        { id: 'PointsAccumulation', title: 'pointsAccumulation' },
                        { id: 'SupplierName', title: 'SupplierName' },
                    ]
                });
                csvWriter.writeRecords(invalidDatas)
                    .then(() => {
                        callBack(false);
                    })
                    .catch(err => {
                        callBack(true);
                    });
            } catch (e) {
                callBack(true);
            }
        }
        // End of Failuer data file create
    }
    return productModule;
}