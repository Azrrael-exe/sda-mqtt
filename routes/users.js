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
  Device.createDevice(req, function(err, newDevice){
    if(err){
      next(err)
    }
    else{
      newDevice.save(function(err){
        if(err){
          next(err)
        }
        else{
          // Push device to owner
          req.user.update({$push: {'devices': newDevice}}, function(err){
            if(err){
              next(err)
            }
            else {
              res.status(200)
              res.message = 'Device Created'
              res.payload = newDevice
              next()
            }
          })
        }
      })
    }
  })
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

router.get('/:username/devices/:device', User.findUser, function(req, res, next){
  if(req.user){
    var device = null
    for(var i = 0; i < req.user.devices.length; i ++){
      if(req.user.devices[i].name == req.params.device){
        device = req.user.devices[i]
      }
    }
    res.payload = device
    next()
  }
  else {
    res.payload = null
    next()
  }
})

router.delete('/:username/devices/:device', User.findUser, function(req, res, next){
  if(req.user){
    var device = null
    for(var i = 0; i < req.user.devices.length; i ++){
      if(req.user.devices[i].name == req.params.device){
        device = req.user.devices[i]
      }
    }
    device.remove(function(err){
      if(err){
        next(err)
      }
      else{
        res.status(200)
        res.payload = device
        next()
      }
    })
  }
  else {
    res.payload = null
    next()
  }
})

module.exports = router
