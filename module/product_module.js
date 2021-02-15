
const products = require('../models/catalouge-schema');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require("crypto");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
module.exports = function () {
    var productModule = {
        //Start of Validation
        excelValidation: function (data, callBack) {
            try {
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
                    || !data.IsDiscountAvailable.toString()
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
        checkDuplicate: function (SupplierUniqueCatalogueNumber, callBack) {
            try {
                products.findOne({ supplier_catalogue_number: SupplierUniqueCatalogueNumber }, function (err, doc) {
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
        csvUpload: function (supplierId,filepath, totalEntryCount, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                rows = []
                fs.createReadStream(filepath)
                    .pipe(csv())
                    .on('data', (rowData) => {
                        rows.push(rowData)
                    })
                    .on('end', () => {
                        if (rows.length !== 0) {
                            var index = 0;
                            var insertData = function (row) {
                                if (row.length !== 0) {
                                    productModule.excelValidation(row, function (status) {
                                        if (status) {
                                            /// DUPLICATE SUPPLIER CATALOUGE NUMBER CHECK
                                            productModule.checkDuplicate(row.SupplierUniqueCatalogueNumber, function (error, isDuplicate) {
                                                if (!isDuplicate) {
                                                    correctEntryCount = correctEntryCount + 1
                                                    const productData = {
                                                        catalogue_number: crypto.randomBytes(6).toString('hex'),
                                                        supplier_catalogue_number: row.SupplierUniqueCatalogueNumber,
                                                        brand_name: row.BrandName,
                                                        generic: row.Generic,
                                                        manufacturer_name: row.Manufacturer,
                                                        description: row.Description,
                                                        dosage: row.Dosage,
                                                        form: row.Form,
                                                        pack_size: row.PackSize,
                                                        pack_size_unit: row.PackSizeUnits,
                                                        product_type: row.ProductType,
                                                        require_rx: row.RequiresRx,
                                                        tax_name: row.TaxName,
                                                        Is_tax_exempt: row.IsTaxExempt,
                                                        Is_tax_included: row.IsTaxIncluded,
                                                        tax_percent: row.TaxPercent,
                                                        price_per_pack: row.PricePerPackage,
                                                        catalog_tag: row.CatalogTag,
                                                        status: row.Status,
                                                        isDiscounted: row.IsDiscountAvailable,
                                                        supplier_id:supplierId,
                                                        timestamp: new Date()
                                                    };
                                                    const product = new products(productData);
                                                    product.save().then(response => {
                                                        index++;
                                                        if (index < rows.length) {
                                                            insertData(rows[index]);
                                                        } else {
                                                            callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                        }
                                                    }).catch(err => {
                                                        
                                                        callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    });
                                                    //////////
                                                }
                                                else {
                                                    duplicateData = duplicateData + 1
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            /////// IF ANY ISSUE FOUND
                                            invalidDatas.push(row)
                                            index++;
                                            if (index < rows.length) {
                                                insertData(rows[index]);
                                            } else {
                                                callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                            }
                                        }
                                    })
                                }
                                else {
                                    index++;
                                    if (index < rows.length) {
                                        insertData(rows[index]);
                                    } else {
                                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                    }
                                }
                            }
                            if (rows.length !== 0) {
                                insertData(rows[index]);
                            }
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
        xlsxUpload: function (supplierId,filepath, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                readXlsxFile(fs.createReadStream(filepath), { sheet: 2 }).then((rows) => {
                    var theRemovedElement = rows.shift();
                    if (rows.length !== 0) {
                        var index = 0;
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
                                    IsDiscountAvailable: doc[19],
                                    supplier_id:supplierId
                                };
                                productModule.excelValidation(data, function (status) {
                                    if (status) {
                                        /// DUPLICATE SUPPLIER CATALOUGE NUMBER CHECK
                                        productModule.checkDuplicate(data.SupplierUniqueCatalogueNumber, function (error, isDuplicate) {
                                            if (!isDuplicate) {
                                                correctEntryCount = correctEntryCount + 1
                                                const productData = {
                                                    catalogue_number: crypto.randomBytes(6).toString('hex'),
                                                    supplier_catalogue_number: doc[1],
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
                                                    supplier_name: doc[20],
                                                    timestamp: new Date()
                                                };
                                                const product = new products(productData);
                                                product.save().then(response => {
                                                    index++;
                                                    if (index < rows.length) {
                                                        insertData(rows[index]);
                                                    } else {
                                                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                    }
                                                }).catch(err => {
                                                    callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                });
                                                //////////
                                            }
                                            else {
                                                duplicateData = duplicateData + 1
                                                index++;
                                                if (index < rows.length) {
                                                    insertData(rows[index]);
                                                } else {
                                                    callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                                }
                                            }
                                        })
                                    }
                                    else {
                                        /////// IF ANY ISSUE FOUND
                                        const invalidData = {
                                            CatalougeNumber: doc[0],
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
                                            IsDiscountAvailable: doc[19],
                                            SupplierName: doc[20]
                                        };
                                        invalidDatas.push(invalidData)
                                        index++;
                                        if (index < rows.length) {
                                            insertData(rows[index]);
                                        } else {
                                            callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                        }
                                    }
                                })
                            }
                            else {
                                index++;
                                if (index < rows.length) {
                                    insertData(rows[index]);
                                } else {
                                    callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                                }
                            }
                        }
                        if (rows.length !== 0) {
                            insertData(rows[index]);
                        }
                    }
                    else {
                        callBack(false, rows.length, correctEntryCount, invalidDatas, duplicateData);
                    }
                })
                    .catch(err => {
                        callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
                    })
            } catch (e) {
                callBack(true, rows.length, correctEntryCount, invalidDatas, duplicateData);
            }
        },
        // End of xlsx file upload
        // Start of Failuer data file create
        failuerFileUpload: function (filename, callBack) {
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
                        { id: 'IsDiscountAvailable', title: 'IsDiscountAvailable' },
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