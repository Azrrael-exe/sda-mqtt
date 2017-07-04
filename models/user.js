var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username : {type: String, required: true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    devices : [{type : mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.findUser = function(req, res, next) {
  mongoose.model('User').findOne({
    $or:[{email : req.body.email || req.params.email},
      {username : req.body.username || req.params.username}]
    }).populate({path : 'devices'}).exec(function(err, user){
    if(err){
      next(err)
    }
    else {
      req.user = user
      next();
    }
  })
}

userSchema.statics.createUser = function(req, next) {
  if(req.user){
    var err = new Error('User already exist')
    err.status = 400
    err.message = 'User already exists'
    return next(err)
  }
  else {
    var email = req.body.email
    var password = req.body.password
    var username = req.body.username
    // Check if the Email is valid
    if((email.indexOf('@') == -1) || (email.indexOf('.') == -1)){
      var err = new Error('Invalid email adress')
      err.status = 400
      err.message = 'Invalid email adress'
      return next(err)
    }
    // Check if the password is long enough
    if(password.length < 6){
      var err = new Error('Password to short')
      err.status = 400
      err.message = 'Password to short'
      return next(err)
    }
    if(!username){
      username = email.split('@')[0]
    }
    var newUser = mongoose.model('User')()
    newUser['email'] = email
    newUser['password'] = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    newUser['username'] = username
    return next(null ,newUser)
  }
}

module.exports = mongoose.model('User', userSchema);
