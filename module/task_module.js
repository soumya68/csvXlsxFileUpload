const Agent = require("../models/agent-schema");
const Carrier = require("../models/carrier-schema");
const Catagory = require("../models/policyCatagory-schema");
const User = require("../models/user-schema");
const UserAccount = require("../models/usersaccount-schema");
const PolicyInfo = require("../models/policyinfo-schema");
const Message = require("../models/message-schema");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const csv = require("csv-parser");
const timeZone = process.env.TIMEZONE;
const cron = require("node-cron");

// Start of Database insert work
exports.dataBaseWork = async (rows) => {
  try {
    for (const row of rows) {
      // INSERT AGENT DATA
      const agentData = new Agent({
        agentName: row.agentName,
      });
      const insertAgentData = await agentData.save(agentData);

      // INSERT CARRIER DATA
      const carrierData = new Carrier({
        companyName: row.company_name,
      });
      const insertCareerData = await carrierData.save(carrierData);

      // INSERT CATAGORY DATA
      const catagoryData = new Catagory({
        catagoryName: row.category_name,
      });
      const insertCatagoryData = await catagoryData.save(catagoryData);

      // INSERT USER DATA
      const userData = new User({
        firstName: row.firstname,
        dob: new Date(row.dob),
        address: row.address,
        phoneNumber: row.policy_number,
        state: row.state,
        zuicode: row.zip,
        email: row.email,
        gender: row.gender,
        userType: row.userType,
      });
      const insertUserData = await userData.save(userData);

      // INSERT USER ACCOUNT DATA
      const userAccountData = new UserAccount({
        accountName: row.account_name,
        userId: insertUserData._id,
      });
      const insertUserAccountData = await userAccountData.save(userAccountData);

      // INSERT POLICY INFO DATA
      const policyInfoData = new PolicyInfo({
        policyNumber: row.policy_number,
        policyStartDate: new Date(row.policy_start_date),
        policyEndDate: new Date(row.policy_end_date),
        policyCatagory: insertCatagoryData._id,
        companyCollectionId: carrierData._id,
        userId: insertUserData._id,
      });
      const insertPolicyInfoData = await policyInfoData.save(policyInfoData);
    }
  } catch (e) {
    return { status: false, message: e };
  }
};
// End of Database insert work
exports.csvUpload = async (filepath) => {
  try {
    rows = [];
    agentDocuments = [];
    // START READING OF CSV FILE
    return new Promise((resolve) => {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on("data", (rowData) => {
          // AFTER READ ALL ROWS OF FILE PUSH DATAS INSIDE ROWS ARRAY
          rows.push(rowData);
        })
        .on("end", async () => {
          if (rows.length !== 0) {
            // DATA INSERTING WORK
            await this.dataBaseWork(rows);

            fs.unlinkSync(filepath);
            resolve({ status: true, message: "file data saved successfully" });
          } else {
            fs.unlinkSync(filepath);
            resolve({ status: false, message: "No data in file" });
          }
        });
    });
  } catch (e) {
    return { status: false, message: e };
  }
};
// End of csv file upload
// Start of xlsx file upload
exports.xlsxUpload = async (filepath) => {
  try {
    return new Promise((resolve) => {
      readXlsxFile(fs.createReadStream(filepath), { sheet: 1 }).then(
        async (rows) => {
          // CHECK IF FILE/ROW HAS DATA OR NOT
          if (rows.length !== 0) {
            // DATA INSERTING WORK

            for (const row of rows) {
              // INSERT AGENT DATA
              const agentData = new Agent({
                agentName: row[0],
              });
              await agentData.save(agentData);

              // INSERT CARRIER DATA
              const carrierData = new Carrier({
                companyName: row[8],
              });
              await carrierData.save(carrierData);

              // INSERT CATAGORY DATA
              const catagoryData = new Catagory({
                catagoryName: row[9],
              });
              const insertCatagoryData = await catagoryData.save(catagoryData);

              // INSERT USER DATA
              const userData = new User({
                firstName: row[16],
                dob: row[23],
                address: row[20],
                phoneNumber: row[19],
                state: row[21],
                zipcode: row[22],
                email: row[15],
                gender: row[16],
                userType: row[1],
              });
              const insertUserData = await userData.save(userData);

              // INSERT USER ACCOUNT DATA
              const userAccountData = new UserAccount({
                accountName: row[13],
                userId: insertUserData._id,
              });
              await userAccountData.save(userAccountData);

              // INSERT POLICY INFO DATA
              const policyInfoData = new PolicyInfo({
                policyNumber: row[4],
                policyStartDate: row[10],
                policyEndDate: row[11],
                policyCatagory: insertCatagoryData._id,
                companyCollectionId: carrierData._id,
                userId: insertUserData._id,
              });
              await policyInfoData.save(policyInfoData);
            }
            fs.unlinkSync(filepath);

            resolve({ status: true, message: "file data saved successfully" });
          } else {
            fs.unlinkSync(filepath);
            resolve({ status: false, message: "No data in file" });
          }
        }
      );
    });
  } catch (e) {
    return { status: false, message: e };
  }
};
// End of xlsx file upload

// End of Database insert work
exports.csvUpload = async (filepath) => {
  try {
    rows = [];
    agentDocuments = [];
    // START READING OF CSV FILE
    return new Promise((resolve) => {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on("data", (rowData) => {
          // AFTER READ ALL ROWS OF FILE PUSH DATAS INSIDE ROWS ARRAY
          rows.push(rowData);
        })
        .on("end", async () => {
          if (rows.length !== 0) {
            // DATA INSERTING WORK
            await this.dataBaseWork(rows);
            // IF NO MORE DATA IN FILE THE INSERT BULK DATA IN MEDICATION COLLECTION

            fs.unlinkSync(filepath);
            resolve({ status: true, message: "file data saved successfully" });
          } else {
            fs.unlinkSync(filepath);
            resolve({ status: false, message: "No data in file" });
          }
        });
    });
  } catch (e) {
    return { status: false, message: e };
  }
};
// End of csv file upload

// Start of Search policyinfo by username
exports.policyInfoByUserName = async (userName) => {
  try {
    let userInfo = await User.find({ firstName: userName });

    let pipeline = [
      {
        $match: { userId: userInfo[0]._id },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "lobs",
          localField: "policyCatagory",
          foreignField: "_id",
          as: "catagoryDetails",
        },
      },
      {
        $lookup: {
          from: "carriers",
          localField: "companyCollectionId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $project: {
          policyNumber: 1,
          policyStartDate: 1,
          policyEndDate: 1,

          userDetails: { firstName: 1 },
          companyDetails: { companyName: 1 },
          catagoryDetails: { catagoryName: 1 },
        },
      },
      { $unwind: { path: "$userDetails" } },
      { $unwind: { path: "$companyDetails" } },
      { $unwind: { path: "$catagoryDetails" } },
    ];
    const policyInfo = await PolicyInfo.aggregate(pipeline);
    return policyInfo;
  } catch (e) {
    return { status: false, message: e };
  }
};
// End of Search policyinfo by username

// Start of Search policyinfo by username
exports.scheduleMassge = async (message, date, timeInMilliSeconds) => {
  try {
    var futureDate = new Date(parseInt(timeInMilliSeconds));
    var month = futureDate.getMonth() + 1;
    var day = futureDate.getDate();
    var year = futureDate.getYear();
    var hour = futureDate.getHours();
    var min = futureDate.getMinutes();
    var seconds = futureDate.getSeconds();
    var inputTime = hour + ":" + min + ":" + seconds + ":" + timeInMilliSeconds;
    let pattern = `${seconds} ${min} ${hour} ${day} ${month} * ${year} `;

    new cron.schedule(
      pattern,
      async () => {
        // INSERT MESSAGE DATA
        try {
          const messageData = new Message({
            message: message,
            date: date,
            time: inputTime,
          });

          await messageData.save(messageData);
        } catch (e) {
          return { status: false, message: e };
        }
      },
      {
        scheduled: false,
        timezone: timeZone,
      }
    ).start();
  } catch (e) {
    return { status: false, message: e };
  }
};

exports.usersPolicyInfo = async (limit, order) => {
  try {
    let pipeline = [
      {
        $sort: {
          createdAt: parseInt(order),
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "policyinfos",
          localField: "_id",
          foreignField: "userId",
          as: "policyDetails",
        },
      },
    ];
    const policyInfo = await User.aggregate(pipeline);
    return policyInfo;
  } catch (e) {
    return { status: false, message: e };
  }
};
