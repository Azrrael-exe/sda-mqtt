var express = require('express');
var router = express.Router();
var Device = require('../models/device')

router.get('/', function(req, res){
  Device.find({owner : req.user._id},function(err, devices){
    if(err){
      res.status(500)
      res.send(err)
    }
    else {
      if(devices.length){
        res.status(200)
        res.send(devices)
      }
      else {
        res.status(404)
        res.send("Not devices found")
      }
    }
  })
})

router.post('/', Device.findDevice, function(req, res){
  if(!req.user){
    res.status(401)
    res.send('User not found')
  }
  else if (req.device){
    res.status(403)
    res.send('that name is unavailable :(')
  }
  else {
    if(req.body.name){
      newDevice = new Device()
      newDevice.name = req.body.name
      newDevice.owner = req.user
      newDevice.save(function(err) {
        if(err){
          res.status(500)
          res.send(err)
        }
        else{
          res.status(200)
          res.send(newDevice)
        }
      })
    }
    else{
      res.status(400)
      res.send('bad requests')
    }
  }
})

router.delete('/', Device.findDevice, function(req, res){
  if(req.device){
    req.device.remove(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        res.status(200)
        res.send(req.device)
      }
    })
  }
  else {
    res.status(404)
    res.send('device not found')
  }
})

module.exports = router
