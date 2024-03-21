const express = require("express");
const app = express();
var os = require("os-utils");
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./database/mongoose");
// const configDetails = require('./config/config.json')
// const PORT = configDetails.development.PORT
var cors = require("cors");
const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
const PORT = process.env.PORT || 8000;
/*middlewares*/
app.use(
  bodyParser.json({
    limit: "150mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
//mongodb connection using mongoose
connectDB();
console.log(process.env.CPUUTILIZATIONCHECKTIME);

// CPU UTILIZATION & RESTART OF SERVER
setInterval(function () {
  os.cpuUsage(function (result) {
    console.log("CPU Usage (%): " + result);
    if (result > parseInt(process.env.CPULOAD)) {
      console.log("restart due to high cpu usage");
      process.exit();
    }
  });
}, parseInt(process.env.CPUUTILIZATIONCHECKTIME));

app.get("/", (req, res) => {
  res.send("Welcome to Task API!");
});
/*Incudes all API routes*/
require("./routes/index")(app, connectDB);
/*Listen express server on port*/
app.listen(PORT, () => {
  console.info(`Server is running on port.... ${PORT}`);
});

module.exports = app;
