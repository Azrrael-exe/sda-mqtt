var express = require('express');
var router = express.Router();
var User = require('../models/user')

router.get('/', function(req, res){
  User.find({},function(err, users){
    if(err){
      res.status(500)
      res.send(err)
    }
    else {
      if(users.length){
        res.status(200)
        res.send(users)
      }
      else {
        res.status(404)
        res.send("Not users found")
      }
    }
  })
})

router.post('/', User.findUser, function(req, res){
  if(!req.user){
    email = req.body.email
    password = req.body.password
    if(email && password){
      if((email.indexOf('@') !== -1) & (email.indexOf('.') !== -1)){
        newUser = new User(),
        newUser.email = email
        newUser.password = newUser.generateHash(password);
        newUser.save(function(err){
          if(err){
            res.status(500)
            res.send(err)
          }
          else {
            res.status(200)
            res.send(newUser)
          }
        })
      }
      else{
        res.status(400)
        res.send('invalid email')
      }
    }
    else {
      res.status(400)
      res.send('bad requests')
    }
  }
  else{
    res.status(401)
    res.send('user already exists')
  }
})

router.delete('/', User.findUser, function(req, res){
  req.user.remove(function(err){
    if(err){
      res.status(500)
      res.send(err)
    }
    else{
      res.status(200)
      res.send(req.user)
    }
  })
})

module.exports = router
