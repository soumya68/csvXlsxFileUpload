module.exports = (app) => {
    var supplierModule = require('../module/supplier_module')();
    //START OF API FOR ADD SUPPLIER DETAILS 
    //Params: supplierName,isoCountry,userId
    //Response: status, message,supplierId,supplierCode
    //Functions:addSupplier
    app.post('/api/add/supplier', function (req, res) {
        try {
            if (!req.body.supplierName) {
                res.status(400).json({ status: false, message: "supplierName parameter is missing" });
                return;
            }
            if (!req.body.isoCountry) {
                res.status(400).json({ status: false, message: "isoCountry parameter is missing" });
                return;
            }
            if (!req.body.userId) {
                res.status(400).json({ status: false, message: "userId parameter is missing" });
                return;
            }
            if (!req.body.supplierCode) {
                res.status(400).json({ status: false, message: "supplierCode parameter is missing" });
                return;
            }
            if (!req.body.address) {
                res.status(400).json({ status: false, message: "address parameter is missing" });
                return;
            }
            if (!req.body.email) {
                res.status(400).json({ status: false, message: "email parameter is missing" });
                return;
            }
            if (!req.body.phone) {
                res.status(400).json({ status: false, message: "phone parameter is missing" });
                return;
            }
            const supplierData = {
                supplierName:
                {
                    eng: req.body.supplierName
                },
                //supplierName: req.body.supplierName,
                supplierCode: req.body.supplierCode,
                isoCountry: req.body.isoCountry,
                catalogTags: req.body.catalogTags,
                contact: {
                    address: req.body.address,
                    email: req.body.email,
                    phone: req.body.phone
                },
                deliveryFee: parseFloat(req.body.deliveryFee).toFixed(2),
                usdPrice: parseFloat(req.body.usdPrice).toFixed(2),
                metadata: {
                    createdBy: {
                        userId: req.body.userId,
                        utcDatetime: new Date()
                    },
                    updatedBy: [],
                    version: req.body.version
                },
                timestamp: new Date()
            };
            // SAVE SUPPLIER DATA IN SUPPLIER COLLECTION BY ADD SUPPLIER COLLECTION
            supplierModule.addSupplier(supplierData,
                function (error, errData, result, message) {
                    if (error & result == null) {
                        res.status(500).json({
                            status: false,
                            // message: Object.keys(errData.errors)[0],
                            message: message,
                            supplierId: null,
                            errData: errData.errors
                        })
                    }
                    else if (error && result) {
                        res.status(500).json({
                            status: false,
                            // message: Object.keys(errData.errors)[0],
                            message: message,
                            supplierId: null,
                            errData: null
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            supplierId: result.supplierId,
                            errData: null
                        })
                    }
                })
        }
        catch (er) {
            res.status(500).json({ status: false, message: er });
        }
    });
    //END OF API FOR ADD SUPPLIER DETAILS 
    //START OF API FOR VIEW ALL SUPPLIER DETAILS 
    //Params:
    //Response: status, message,data
    //Functions:viewSupplier
    app.get('/api/view/allsuppliers', function (req, res) {
        try {
            supplierModule.viewSuppliers(
                function (error, message, result) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            message: message,
                            data: result
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            data: result
                        })
                    }
                })
        }
        catch (er) {
            res.status(500).json({ status: false, message: er });
        }
    });
    //END OF API FOR VIEW ALL SUPPLIER DETAILS 
    //START OF API FOR VIEW SUPPLIER DETAILS 
    //Params:
    //Response: status, message,data
    //Functions:viewSingleSupplier
    app.get('/api/view/singlesupplier/:supplierCode', function (req, res) {
        try {
            if (!req.params.supplierCode) {
                res.status(400).json({ status: false, message: "supplierCode parameter is missing" });
                return;
            }
            let supplierCode = req.params.supplierCode
            supplierModule.viewSingleSupplier(supplierCode,
                function (error, message, result) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            message: message,
                            data: result
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: message,
                            data: result
                        })
                    }
                })
        }
        catch (er) {
            res.status(500).json({ status: false, message: er });
        }
    });
    //END OF API FOR VIEW SUPPLIER DETAILS 
};