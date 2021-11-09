require('dotenv').config();

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const router = express.Router()
// const bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors');
const fs = require('fs');

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
const sketchManager = new (require('./src/js/SketchManager'))();

sketchManager.create('AAAAAA');

app.engine('hbs', exphbs({
    defaultLayout: 'app',
    extname: '.hbs',
    partialsDir: path.join(__dirname, '/views/partials/'),
    helpers:{
        "inc": function(value, options) {
            return parseInt(value) + 1;
        },
        "ifNull": function(value, def) {
            return value||def
        },
        "isEqualToZero": function(value, def) {
            return value === 0;
        },
        "year": function(value) {
            return (new Date()).getFullYear();
        },
        "hiddenIfNotEqual": function(value, options) {
            return value===options?'':'hidden'
        }
    }
}));
app.set('view engine', 'hbs');

// // support request
// app.use(bodyParser.json());                         // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());                            // to support JSON-encoded bodies
app.use(express.urlencoded());                      // to support URL-encoded bodies

//add the router folders
app.use(cors());
app.use(express.static(__dirname + '/public'));             // Store all assets, js and css files in public folder.
app.use(express.static(__dirname + '/src/views'));    // Store all HTML files in view folder.

app.use('/', router);       // add the router

//routes and ioController
require('./src/js/routes')(router, sketchManager);          
require('./src/js/ioController')(io, sketchManager);

// app.listen(process.env.port || 80);


io.sockets.on("error", e => console.log(e));
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
server.listen(PORT, HOST, () => console.log(`Server is running on ${HOST}:${PORT}`));