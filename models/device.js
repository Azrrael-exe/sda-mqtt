var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var deviceSchema = mongoose.Schema({
    name : {type : String, required : true},
    owner : {type : mongoose.Schema.Types.ObjectId}
});

deviceSchema.statics.findDevice = function(req, res, next) {
  mongoose.model('Device').findOne({name : req.body.name || req.params.name},
    function(err, device){
    if(err){
      res.status(500);
      res.send(err)
    }
    else {
      req.device = device
      next();
    }
  })
}

module.exports = mongoose.model('Device', deviceSchema);
