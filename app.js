var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session')

var index = require('./routes/index');
var response = require('./config/responses')
var mongoose = require('mongoose');
require('./config/passport')(passport)

var broker = require('./broker/broker')

app.use(session({
  secret: process.env.SESSION_SECRET || 'superSecret123456',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/sda-mqtt");

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/', index)

app.use(response.resHandler)
app.use(response.errHandler)

module.exports = app
