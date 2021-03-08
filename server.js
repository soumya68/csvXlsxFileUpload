const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
const connectDB = require('./database/mongoose');
const config = require('config');
const configDetails = require('./config/config.json')
const PORT = configDetails.development.PORT
var cron = require('node-cron');
//const PORT = 8000

/*middlewares*/
app.use(bodyParser.json({
    limit: '150mb',
    verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//mongodb connection using mongoose
connectDB()

app.get('/', (req, res) => {
    res.send('Welcome to Unicef API!')
})

/*Incudes all API routes*/
require('./routes/index')(app, connectDB);

/*Listen express server on port*/
app.listen(process.env.PORT || PORT, () => {
    console.info(`Server is running on port.... ${process.env.PORT || PORT}`);
});


// cron.schedule('* * * * *', () => {
//     console.log('running a task every minute');
//   });


  
//   cron.schedule('59 23 * * *', () => {
//     console.log('running a task at 11:59 PM every day');
//   });

//mongodb+srv://admin:vishal1234@cluster0.yuwek.mongodb.net/products?retryWrites=true&w=majority
//mongodb+srv://gstuser:n03ntry428@cluster0-i3gc0.mongodb.net/helmethead?retryWrites=true&w=majority
//mongodb+srv://unicef:unicef@cluster0.xwra6.mongodb.net/unicef?retryWrites=true&w=majority
//mongodb+srv://kunalsolace:Kunal2021@realmcluster.bulij.mongodb.net/InventoryDemo