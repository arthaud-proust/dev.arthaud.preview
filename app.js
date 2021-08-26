const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
require('dotenv').config();
const path = require('path');
var cors = require('cors')

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
const sketchManager = new (require('./resources/js/sketchManager'))();

sketchManager.create('AAAAA');

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
        }
    }
}));
app.set('view engine', 'hbs');

// // support request
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());                            // to support JSON-encoded bodies
app.use(express.urlencoded());                      // to support URL-encoded bodies

//add the router folders
app.use(cors());
app.use(express.static(__dirname + '/public'));             // Store all assets, js and css files in public folder.
app.use(express.static(__dirname + '/resources/views'));    // Store all HTML files in view folder.

app.use('/', router);       // add the router

//routes and ioController
require('./resources/js/routes')(router, sketchManager);          
require('./resources/js/ioController')(io, sketchManager);

// app.listen(process.env.port || 80);

io.sockets.on("error", e => console.log(e));
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
