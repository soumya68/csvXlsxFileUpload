
const order = require('../models/order-schema');
module.exports = function () {
    var orderModule = {


        // Start of  create order details
        createOrder: function (orderData, callBack) {
            try {
               


            } catch (e) {
                console.log(e)
                callBack(true, null);
            }
        },
        // End of create order details
    }
    return orderModule;

}
