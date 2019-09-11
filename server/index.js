import {valueFBData} from "./handlers/ValueFBHandler.js"
import {valueGoogleData} from "./handlers/ValueGoogleHandler"
import {processLogin, processSignUp} from "./handlers/UserHandler"
import MongoHelper from "./MongoHelper"

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const MongoPool = require('mongopooler');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('./server'+'/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage, limits: { fileSize: '50mb' }})

const app = express();
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
app.use(express.static(DIST_DIR));
app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

var options = { numberOfRetries : 5, auto_reconnect: true, poolSize : 40, connectTimeoutMS: 500 };

let mongo = process.env.MONGO;
let PORT = process.env.PORT || 3000;;

MongoPool.createPool(mongo, options);

app.post('/valueFB', upload.single('fbFile'), valueFBData);

app.post('/valueGoogle', upload.single('googleFile'), valueGoogleData);

//app.post('/loginUser', processLogin);

// app.post('/signUpUser', processSignUp)

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.post('/api/appendEntry', (req, res) => {
  let {entry} = req.body;
  MongoHelper.appendPriceEntry(entry);
  res.json({
    status: "true"
  })
})

app.post('/fetchUserCount', async (req, res) => {
  let userCount = await MongoHelper.getUserCount();
  res.json({
    count: userCount
  })
})

/*

app.post('/api/fetchFBMeans', async (req, res) => {
  let valueSet = await MongoHelper.getFBMap();
  res.json({valueSet});
})

app.post('/api/fetchGoogleMeans', async (req, res) => {
  let valueSet = await MongoHelper.getGoogleMap();
  res.json({valueSet});
})

*/

app.listen(PORT, function () {
 console.log('App listening on port: ' + PORT);
});