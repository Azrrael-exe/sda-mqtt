var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email : {type : String, required : true},
    password : {type : String, required : true}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.findUser = function(req, res, next) {
  mongoose.model('User').findOne({email : req.body.email || req.params.email},
    function(err, user){
    if(err){
      res.status(500);
      res.send(err)
    }
    else {
      req.user = user
      next();
    }
  })
}

module.exports = mongoose.model('User', userSchema);
