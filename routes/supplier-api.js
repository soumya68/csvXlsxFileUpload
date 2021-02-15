const bodyParser = require('body-parser');

module.exports = (app, connection) => {
    app.use(bodyParser.json());
    var supplierModule = require('../module/supplier_module')();

    //START OF API FOR ADD SUPPLIER DETAILS 
    //Params: file
    //Response: status, message
    app.post('/api/add_supplier', function (req, res) {
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

console.log('BODY',req.body)

            const supplierData = {
                supplierName: JSON.parse(req.body.supplierName),
                supplierCode: Math.floor(Math.random() * 1000000),
                isoCountry: req.body.isoCountry,
                catalogTags:  JSON.parse(req.body.catalogTags),
                contact: {
                    address:  JSON.parse(req.body.address),
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

            console.log('DATA',supplierData)

            supplierModule.addSupplier(supplierData,
                function (error, result) {
                    if (error) {
                        res.status(200).json({
                            status: false,
                            message: "Error",
                            supplierId: null
                        })
                    }
                    else {
                        res.status(200).json({
                            status: true,
                            message: "Supplier details created successfully",
                            supplierId: result._id

                        })
                    }
                })

        }
        catch (er) {
            console.log(er)
            res.json({ status: false, message: er });
        }
    });
    //END OF API FOR ADD SUPPLIER DETAILS 
};