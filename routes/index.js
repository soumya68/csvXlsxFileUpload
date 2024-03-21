"use strict";
function includeAllRoutes(app, connection) {
  require("./task-api")(app, connection);
}
module.exports = (app, connection) => {
  includeAllRoutes(app, connection);
};
