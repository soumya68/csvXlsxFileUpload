module.exports = (app) => {
    var supplierModule = require('../module/supplier_module')();
    //START OF API FOR ADD SUPPLIER DETAILS 
    //Params: file
    //Response: status, message
    app.post('/api/add/supplier', function (req, res) {
        try {
            if (!req.body.supplierName) {
                res.json({ status: false, message: "supplierName parameter is missing" });
                return;
            }
            if (!req.body.isoCountry) {
                res.json({ status: false, message: "isoCountry parameter is missing" });
                return;
            }
            if (!req.body.userId) {
                res.json({ status: false, message: "userId parameter is missing" });
                return;
            }
            if (!req.body.supplierCode) {
                res.json({ status: false, message: "supplierCode parameter is missing" });
                return;
            }
            const supplierData = {
                supplierName: JSON.parse(req.body.supplierName),
                supplierCode: req.body.supplierCode,
                isoCountry: req.body.isoCountry,
                catalogTags: JSON.parse(req.body.catalogTags),
                contact: {
                    address: JSON.parse(req.body.address),
                    email: req.body.email,
                    phone: req.body.phone
                },
                deliveryFee: req.body.deliveryFee,
                lastProductSeq: req.body.lastProductSeq,
                type: req.body.type,
                usdPrice: req.body.usdPrice,
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
            supplierModule.addSupplier(supplierData,
                function (error, errData, result) {
                    if (error) {
                        res.status(200).json({
                            status: false,
                            message: Object.keys(errData.errors)[0],
                            supplierId: null,
                            errData: errData.errors
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: "Supplier details created successfully",
                            supplierId: result.supplierId
                        })
                    }
                })
        }
        catch (er) {
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR ADD SUPPLIER DETAILS 
};