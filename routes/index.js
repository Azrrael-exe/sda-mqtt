var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require('jsonwebtoken');
var auth = require('../config/auth')

var user = require('./user')
var device = require('./device')

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

router.use('/user', user)

router.use('/device', auth.verifyToken, device)

module.exports = router
