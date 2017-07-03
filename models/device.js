var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var deviceSchema = mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String},
    owner : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

deviceSchema.statics.findDevice = function(req, res, next) {
  mongoose.model('Device').findOne({name : req.body.name || req.params.name},
    function(err, device){
    if(err){
      next(err)
    }
    else {
      req.device = device
      next();
    }
  })
}

deviceSchema.statics.createDevice = function(req, next){
  if(req.user){
    var name = req.body.name
    var description = req.body.description || 'No description provided'
    // Check if the Device had a duplicated name
    var duplicated = false;
    for(var i=0; i < req.user.devices.length; i++){
      if(req.user.devices[i].name == name){
        duplicated = true;
      }
    }
    if(duplicated){
      var err = new Error('Device name already taked')
      err.status = 400
      err.message = 'Device name already taked'
      return next(err)
    }
    else {
      var newDevice = mongoose.model('Device')()
      newDevice['name'] = name
      newDevice['description'] = description
      newDevice['owner'] = req.user._id
      return next(null, newDevice)
    }
  }
  else{
    var err = new Error('User not found')
    err.status = 400
    err.message = 'User not found'
    return next(err)
  }
}

module.exports = mongoose.model('Device', deviceSchema);
