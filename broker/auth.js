var User = require('../models/user');
var Device = require('../models/device');

module.exports = {
  authenticate : function(client, username, password, callback) {
    User.findOne({email : username}).populate({path : 'devices', select : 'name'}).exec(function(err, user) {
      if(user){
        if(user.validPassword(password.toString())){
          client.user = username;
        }
        else {
          for (var i=0; i < user.devices.length; i++){
            if(user.devices[i].name == client.id){
              client.user = client.id
              break;
            }
          }
        }
        if(client.user){
          allowed = [client.user]
          if(username != client.user){
            allowed.push(username)
          }
          for (var i=0; i < user.devices.length; i++){
            if(client.user != user.devices[i].name){
              allowed.push(user.devices[i].name)
            }
          }
          client.allowed = allowed
          return callback(null, true)
        }
        return callback(null, false)
      }
      else {
        return callback(null, false)
      }
    })
  },
  authorizePublish : function(client, topic, payload, callback) {
    callback(null, true);
  },
  authorizeSubscribe : function(client, topic, callback) {
    callback(null, true);
  }
}
