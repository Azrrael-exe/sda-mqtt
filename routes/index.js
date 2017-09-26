var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require('jsonwebtoken');
var auth = require('../config/auth')
var User = require('../models/user')

var users = require('./users')

var masterkey = process.env.MASTERKEY || 'Maxwell'

router.post('/signup', User.findUser, function(req, res, next){
  if(req.body.masterkey == masterkey){
    User.createUser(req, function(err, newUser){
      if(err){
        next(err)
      }
      else{
        newUser.save(function(err){
          if(err){
            next(err)
          }
          else {
            res.status(200)
            res.message = 'User Created'
            res.payload = newUser
            next()
          }
        })
      }
    })
  }
  else {
    var err = new Error('Invalid Masterkey')
    err.status = 401
    err.message = 'Invalid Masterkey'
    return next(err)
  }
})

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
