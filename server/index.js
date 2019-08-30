import {valueFBData} from "./handlers/ValueFBHandler.js"
import {processLogin, processSignUp} from "./handlers/UserHandler"

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const MongoPool = require('mongopooler');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname+'/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage, limits: { fileSize: '50mb' }})

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
app.use(express.static(DIST_DIR));
app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

var options = { numberOfRetries : 5, auto_reconnect: true, poolSize : 40, connectTimeoutMS: 500 };
var localURL = "mongodb://localhost:27017/"
MongoPool.createPool(localURL, options);

app.post('/valueFB', upload.single('fbFile'), valueFBData);

//app.post('/loginUser', processLogin);

// app.post('/signUpUser', processSignUp)

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});