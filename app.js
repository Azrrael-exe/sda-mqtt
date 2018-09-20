var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var broker = require('./broker/broker')

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send("Mosca Server Running!");
})

module.exports = app
