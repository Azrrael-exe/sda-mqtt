var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require('jsonwebtoken');
var auth = require('../config/auth')

var users = require('./users')

router.post('/auth', passport.authenticate('local-login', {failureRedirect : '/'}), function(req, res){
  var token = jwt.sign(req.user, process.env.TOKEN_SECRET|| 'superSecret', {
    algorithm: "HS256",
    expiresIn: '1440m'
  });
  res.status(200)
  res.json({
    token : token
  })
})

router.use('/users', auth.verifyToken, users)

module.exports = router
