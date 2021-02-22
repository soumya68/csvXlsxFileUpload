const products = require('../models/catalouge-schema');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require("crypto");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
module.exports = function () {
    var productModule = {
         // Start Generating catalogue number -----
         catalogueNumber: function (callBack) {
            try {
                products.find().sort({r52CatNo:-1}).limit(1).then((data)=>{
                    if(data.length>0){
                     var dbNum = data[0].r52CatNo;
                       //var dbNum = "10000000"
                        for(var i=0;i<=data.length;i++){
                            var str= "CT"
                            var r52CatNumber = dbNum++;
                        }
                        callBack(r52CatNumber);
                       
                    }
                    else{
                        r52CatNumber = "10000000";
                        callBack(r52CatNumber);
                    }
                }).catch(err => {
                    console.log(err);
                }); 
                 
            } catch (e) {
                callBack(null);
            }
        },
        // End Generating catalogue number -----
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
        checkDuplicate: function (SupplierUniqueCatalogueNumber,supplier_id, callBack) {
            try {
                products.findOne({ suppCatNo: SupplierUniqueCatalogueNumber }, function (err, doc) {
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
        csvUpload: function (userId, version, supplierId, filepath, totalEntryCount, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                var isIncluded
                var IsTaxExempt
               // var r52CatNo = crypto.randomBytes(6).toString('hex')
               var r52CatNo;
                rows = []
                fs.createReadStream(filepath)
                    .pipe(csv())
                    .on('data', (rowData) => {
                        rows.push(rowData)
                    })
                    .on('end', () => {
                        let test = productModule.catalogueNumber(function (result) {
                            r52CatNo = result
                            return r52CatNo
                        })  
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
                                                        // catalogue_number: r52CatNo,
                                                        // supplier_catalogue_number: row.SupplierUniqueCatalogueNumber,
                                                        // brand_name: row.BrandName,
                                                        // generic: row.Generic,
                                                        // manufacturer_name: row.Manufacturer,
                                                        // description: row.Description,
                                                        // dosage: row.Dosage,
                                                        // form: row.Form,
                                                        // pack_size: row.PackSize,
                                                        // pack_size_unit: row.PackSizeUnits,
                                                        // product_type: row.ProductType,
                                                        // require_rx: row.RequiresRx,
                                                        // tax_name: row.TaxName,
                                                        // Is_tax_exempt: row.IsTaxExempt,
                                                        // Is_tax_included: row.IsTaxIncluded,
                                                        // tax_percent: row.TaxPercent,
                                                        // price_per_pack: row.PricePerPackage,
                                                        // catalog_tag: row.CatalogTag,
                                                        // status: row.Status,
                                                        // isDiscounted: row.IsDiscountAvailable,
                                                        // supplier_id: supplierId,
                                                        // timestamp: new Date(),
                                                        supplierId: supplierId,
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
                                                        isDiscounted: row.IsDiscountAvailable,
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
                                                    const productUpdateData = {
                                                        supplierId: supplierId,
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
                                                        isDiscounted: doc[19],
                                                        metadata: {
                                                            
                                                            updatedBy: [],
                                                            version: version
                                                        },
                                                        timestamp: new Date(),
                                                    };
                                                    products.findOneAndUpdate(data.SupplierUniqueCatalogueNumber,
                                                        { $set: productUpdateData },
                                                        { new: true }) .then(result => {
                                                           // console.log('Product updated successfully');
                                                        }).catch(err => {
                                                            console.log('error',error)
                                                        });
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
                                            var invaliRow = row
                                            invaliRow.CatalougeNumber = r52CatNo
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
        xlsxUpload:  function (userId, version, supplierId, filepath, correctEntryCount, invalidDatas, duplicateData, callBack) {
            try {
                var isIncluded
                var IsTaxExempt
               // var r52CatNo = crypto.randomBytes(6).toString('hex')
               var r52CatNo
                readXlsxFile(fs.createReadStream(filepath), { sheet: 2 }).then((rows) => {
                   
                    var theRemovedElement = rows.shift();
                    if (rows.length !== 0) {
                      
                        var index = 0;
                        var insertData = function (doc) {
                            if (doc.length !== 0) {
                                
                                let test =  productModule.catalogueNumber(function (result) {
                                    r52CatNo = result
                                    return r52CatNo
                                })
                                /* setTimeout(()=>{
                                },4000); */
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
                                    supplier_id: supplierId,
                                };
                                productModule.excelValidation(data, function (status) {
                                    if (status) {
                                        /// DUPLICATE SUPPLIER CATALOUGE NUMBER CHECK
                                        productModule.checkDuplicate(data.SupplierUniqueCatalogueNumber,data.supplier_id, function (error, isDuplicate) {
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
                                                    // catalogue_number: crypto.randomBytes(6).toString('hex'),
                                                    // supplier_catalogue_number: doc[1],
                                                    // brand_name: doc[2],
                                                    // generic: doc[3],
                                                    // manufacturer_name: doc[4],
                                                    // description: doc[5],
                                                    // dosage: doc[6],
                                                    // form: doc[7],
                                                    // pack_size: doc[8],
                                                    // pack_size_unit: doc[9],
                                                    // product_type: doc[10],
                                                    // require_rx: doc[11],
                                                    // tax_name: doc[12],
                                                    // Is_tax_exempt: doc[13],
                                                    // Is_tax_included: doc[14],
                                                    // tax_percent: doc[15],
                                                    // price_per_pack: doc[16],
                                                    // catalog_tag: doc[17],
                                                    // status: doc[18],
                                                    // isDiscounted: doc[19],
                                                    // supplier_name: doc[20],
                                                    // timestamp: new Date(),
                                                    supplierId: supplierId,
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
                                                    isDiscounted: doc[19],
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
                                                const productUpdateData = {
                                                    supplierId: supplierId,
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
                                                    isDiscounted: doc[19],
                                                    metadata: {
                                                        
                                                        updatedBy: [],
                                                        version: version
                                                    },
                                                    timestamp: new Date(),
                                                };
                                                products.findOneAndUpdate(data.SupplierUniqueCatalogueNumber,
                                                    { $set: productUpdateData },
                                                    { new: true }) .then(result => {
                                                       // console.log('Product updated successfully');
                                                    }).catch(err => {
                                                        console.log('error',error)
                                                    });
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
                                            CatalougeNumber: r52CatNo,
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