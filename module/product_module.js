const bodyParser = require('body-parser');
const products = require('../models/catalouge-schema');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require("crypto");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
module.exports = function () {
    var product_module = {
        //Start of Validation
        excel_validation: function (data, callBack) {
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
        // Start of csv file upload
        csv_upload: function (filepath, total_entry_count, correct_entry_count, invalid_datas, callBack) {
            try {
                fs.createReadStream(filepath)
                    .pipe(csv())
                    .on('data', (row) => {
                        total_entry_count = total_entry_count + 1
                        product_module.excel_validation(row, function (status) {
                            if (status) {
                                correct_entry_count = correct_entry_count + 1
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
                                    supplier_name: row.SupplierName,
                                    timestamp: new Date()
                                };
                                const product = new products(productData);
                                product.save().then(response => {
                                }).catch(err => {
                                    callBack(true, total_entry_count, correct_entry_count, invalid_datas);
                                });
                            }
                            else {
                                /////// IF ANY ISSUE FOUND
                                invalid_datas.push(row)
                            }
                        })
                    })
                    .on('end', () => {
                        callBack(false, total_entry_count, correct_entry_count, invalid_datas);
                    })
            } catch (e) {
                callBack(true, total_entry_count, correct_entry_count, invalid_datas);
            }
        },
        // End of csv file upload
        // Start of xlsx file upload
        xlsx_upload: function (filepath, correct_entry_count, invalid_datas, callBack) {
            try {
                readXlsxFile(fs.createReadStream(filepath), { sheet: 2 }).then((rows) => {
                    var theRemovedElement = rows.shift();
                    if (rows.length !== 0) {
                        var index = 0;
                        var insert_data = function (doc) {
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
                                    SupplierName: doc[20]
                                };
                                product_module.excel_validation(data, function (status) {
                                    if (status) {
                                        correct_entry_count = correct_entry_count + 1
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
                                                insert_data(rows[index]);
                                            } else {
                                                callBack(false, rows.length, correct_entry_count, invalid_datas);
                                            }
                                        }).catch(err => {
                                            callBack(true, rows.length, correct_entry_count, invalid_datas);
                                        });
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
                                        invalid_datas.push(invalidData)
                                        index++;
                                        if (index < rows.length) {
                                            insert_data(rows[index]);
                                        } else {
                                            callBack(false, rows.length, correct_entry_count, invalid_datas);
                                        }
                                    }
                                })
                            }
                            else {
                                index++;
                                if (index < rows.length) {
                                    insert_data(rows[index]);
                                } else {
                                    callBack(false, rows.length, correct_entry_count, invalid_datas);
                                }
                            }
                        }
                        if (rows.length !== 0) {
                            insert_data(rows[index]);
                        }
                    }
                    else {
                        callBack(false, rows.length, correct_entry_count, invalid_datas);
                    }
                })
                    .catch(err => {
                        callBack(true, rows.length, correct_entry_count, invalid_datas);
                    })
            } catch (e) {
                callBack(true, rows.length, correct_entry_count, invalid_datas);
            }
        },
        // End of xlsx file upload
        /// Failuer data file create
        failuer_file_upload: function (filename, callBack) {
            try {
                const csvWriter = createCsvWriter({
                    path: 'Failure_Products_Details/Failed' + filename,
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
                csvWriter.writeRecords(invalid_datas)
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
    }
    return product_module;
}