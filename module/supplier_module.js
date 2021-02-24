const supplier = require('../models/supplier-schema');
module.exports = function () {
    var supplierModule = {
        //Start of add supplier details
        addSupplier: function (supplierData, callBack) {
            try {
                const supplierDetails = new supplier(supplierData);
                supplierDetails.save().then(response => {
                    callBack(false, null, response,);
                })
                    .catch(err => {
                        callBack(true, err, null,);
                    });
            } catch (err) {
                callBack(true, err, null,);
            }
        }
        // End of add supplier details
    }
    return supplierModule;
}