"use strict";

function includeAllRoutes(app, connection) {
	require('./product-api')(app, connection);
	require('./supplier-api')(app, connection);
}

module.exports = (app, connection) => {
	includeAllRoutes(app, connection);
};
