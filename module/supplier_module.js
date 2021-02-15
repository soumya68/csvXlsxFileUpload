
const supplier = require('../models/supplier-schema');

module.exports = function () {
    var supplierModule = {
        //Start of add supplier details
        addSupplier: function (supplierData, callBack) {
            try {
                
                const supplierDetails = new supplier(supplierData);
                supplierDetails.save().then(response => {
                    console.log(response)
                    callBack(false,response);
                })
                .catch(err => {
                    console.log(err)
                    callBack(true,null);
                    // return res.status(400).json({ status: false, message: err });
                });
            } catch (e) {
                console.log(err)
                callBack(true,null);
            }
        }
        // End of add supplier details
    }
    return supplierModule;
}