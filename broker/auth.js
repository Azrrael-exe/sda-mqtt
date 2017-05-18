var User = require('../models/user');
var Device = require('../models/device');

module.exports = {
  authenticate : function(client, username, password, callback) {
    User.findOne({email : username}, function(err, user){
      if(user){
        if(!user.validPassword(password.toString())){
          return callback(null, false);
        }
        else {
          return callback(null, true)
        }
      }
    })
  },
  authorizePublish : function(client, topic, payload, callback) {
    callback(null, client.user == topic.split('/')[1]);
  },
  authorizeSubscribe : function(client, topic, callback) {
    callback(null, client.user == topic.split('/')[1]);
  }
}
