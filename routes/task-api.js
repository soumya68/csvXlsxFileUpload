const path = require("path");

const DIRECTORY = require("../config/fileDetails.json");
const multer = require("multer");
let taskModule = require("../module/task_module");
module.exports = (app) => {
  // FILE UPLOAD FOLDER PATH
  var DIR = DIRECTORY.DIR;
  // STORAGE OF MULTER
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, callback) {
      // MAKING DATE PART FOR FILE NAME
      var date = new Date();
      var milliseconds = date.getTime();
      var ml = milliseconds.toString();
      var dateStr = ml;
      // MAKING FILENAME WITH  MILISECONDS OF FILEUPLOADTIME
      var customeFileName = dateStr;
      // CHECKING FILE EXTENSION & MAKING FILE NAME
      if (
        file.mimetype == "text/csv" ||
        file.mimetype == "application/vnd.ms-excel"
      ) {
        const fileName = customeFileName + ".csv";
        callback(null, fileName);
      } else {
        const fileName = customeFileName + ".xlsx";
        callback(null, fileName);
      }
    },
  });
  // File type validation  by multer
  var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // File size must be below 1 MB
    fileFilter: (req, file, cb) => {
      // FILE TYPE ONLY CSV OR XLSX IS ALLOWED
      if (
        file.mimetype == "text/csv" ||
        file.mimetype == "application/vnd.ms-excel" ||
        file.mimetype == "application/vnd.ms-excel" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .csv format is allowed!"));
      }
    },
  });

  //START OF API FOR FILE DETAILS EXCELSHEET/CSV IMPORT
  //Params: file
  //Functions: xlsxUpload,csvUpload
  //Response: status, message
  app.post("/api/upload/file", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(422)
          .json({ status: false, message: "No file passed" });
      }
      // File path where file is saved
      let filePath = path.resolve(DIR + req.file.filename);
      let taskResponse = null;
      if (
        req.file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        ////// THIS IS FOR XLSX FILE
        taskResponse = await taskModule.xlsxUpload(filePath);
      } else {
        ////// THIS IS FOR CSV FILE
        taskResponse = await taskModule.csvUpload(filePath);
      }
      if (taskResponse.status) {
        return res.status(201).json(taskResponse);
      }
      return res.status(204).json(taskResponse);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error while uploading file", error: err });
    }
  });
  //END OF API FOR FILE DETAILS EXCELSHEET/CSV IMPORT

  //START OF API FOR POLICY DETAILS BY USER NAME DETAILS
  //Params:username
  //Response: status, message,data
  //Functions:policyInfoByUserName
  app.get("/api/search", async function (req, res) {
    try {
      if (!req.body.username) {
        return res
          .status(422)
          .json({ status: false, message: "username missing" });
      }
      const policyData = await taskModule.policyInfoByUserName(
        req.body.username
      );
      if (policyData.length == 0) {
        return res.status(204).json({
          status: true,
          message: "user policies not found",
          data: policyData,
        });
      }
      return res
        .status(200)
        .json({ status: true, message: "working fine", data: policyData });
    } catch (er) {
      res.status(500).json({ status: false, message: er });
    }
  });
  //END OF API FOR POLICY DETAILS BY USER NAME DETAILS

  //START OF API FOR ALL USERS POLICY DETAILS
  //Params:limit,order
  //Response: status, message,data
  //Functions:usersPolicyInfo
  app.get("/api/userspolicy", async function (req, res) {
    try {
      if (!req.body.limit) {
        return res
          .status(422)
          .json({ status: false, message: "limit missing" });
      }
      if (!req.body.order) {
        return res
          .status(422)
          .json({ status: false, message: "order missing" });
      }
      let { limit, order } = req.body;

      const policyData = await taskModule.usersPolicyInfo(limit, order);
      if (policyData.length == 0) {
        return res.status(204).json({
          status: true,
          message: "user policies not found",
          data: policyData,
        });
      }
      return res.status(200).json({
        status: true,
        message: "user policies found",
        data: policyData,
      });
    } catch (er) {
      res.status(500).json({ status: false, message: er });
    }
  });
  //END OF API FOR ALL USERS POLICY DETAILS

  //START OF API FOR SCHEDULE A MESSAGE
  //Params:
  //Response: status, message,data
  //Functions:policyInfoByUserName
  app.post("/api/message", async function (req, res) {
    try {
      if (!req.body.message) {
        return res
          .status(422)
          .json({ status: false, message: "message is missing" });
      }
      if (!req.body.date) {
        return res
          .status(422)
          .json({ status: false, message: "date is missing" });
      }
      if (!req.body.time) {
        return res
          .status(422)
          .json({ status: false, message: "time is missing" });
      }

      await taskModule.scheduleMassge(
        req.body.message,
        req.body.date,
        req.body.time
      );

      return res
        .status(200)
        .json({ status: true, message: "message will be added" });
    } catch (er) {
      return res.status(500).json({ status: false, message: er });
    }
  });
  //END OF API FOR SCHEDULE A MESSAGE
};
