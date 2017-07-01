var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Device = require('../models/device')

router.get('/', function(req, res, next){
  User.find({},function(err, users){
    if(err){
      next(err)
    }
    else {
      res.payload = users
      res.message = 'List of users'
      res.status(200)
      next();
    }
  })
})

router.post('/', User.findUser, function(req, res, next){
  var user = User.createUser(req.user, req, next)
  if(user){
    user.save(function(err){
      if(err){
        next(err)
      }
      else {
        res.status(200)
        res.message = 'User Created'
        res.payload = user
        next()
      }
    })
  }
})

// ---- User endpoints ----

router.get('/:username', User.findUser, function(req, res, next){
  if(req.user){
    res.status(200)
    res.message = 'User Info'
    res.payload = req.user
    next()
  }
  else {
    res.payload = null
    next()
  }
})

router.put('/:username', User.findUser, function(req, res, next){
  if(req.user){
    next()
  }
  else {
    res.payload = null
    next()
  }
})

router.delete('/:username', User.findUser, function(req, res, next){
  if(req.user){
    req.user.remove(function(err){
      if(err){
        next(err);
      }
      else{
        // Delete devices for this owner
        for(var i=0; i < req.user.devices.length; i++){
          req.user.devices[i].remove()
        }
        res.status(200)
        res.message = 'User deleted'
        res.payload = req.user
        next();
      }
    })
  }
  else{
    res.payload = null
    next()
  }
})

// ---- Devices endpoints ----

router.post('/:username/devices/', User.findUser, function(req, res, next){
  var device = Device.createDevice(req.user, req, next)
  if(device){
    device.save(function(err){
      if(err){
        next(err)
      }
      else {
        // Push device to owner
        req.user.update({$push: {'devices': device}}, function(err){
          if(err){
            next(err)
          }
          else {
            res.status(200)
            res.message = 'Device Created'
            res.payload = device
            next()
          }
        })
      }
    })
  }
})

router.get('/:username/devices/', User.findUser, function(req, res, next){
  if(req.user){
    res.status(200)
    res.message = 'List of devices'
    res.payload = req.user.devices
    next()
  }
  else {
    res.payload = null
    next()
  }
})

// ---- Especific device endpoints

router.get('/:user/devices/:device', User.findUser, function(req, res){

})

router.delete('/:user/devices/:device', User.findUser, function(req, res, next){
  
})

module.exports = router
