var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var passport = require('passport');

var index = require('./routes/index')

var mongoose = require('mongoose');
require('./config/passport')(passport)

var broker = require('./broker/broker')

app.use(passport.initialize());

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/sda-mqtt");

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', index)

app.get("/", function(req, res){
  res.json({message:'Welcome!'})
})

app.all('*', function(req, res) {
  res.redirect("/");
});

module.exports = app
