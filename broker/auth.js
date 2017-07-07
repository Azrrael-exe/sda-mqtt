var User = require('../models/user');
var Device = require('../models/device');

module.exports = {
  authenticate : function(client, username, password, callback) {
    User.findOne({email : username}).populate({path : 'devices', select : 'name token'}).exec(function(err, user) {
      if(user){
        if(user.validPassword(password.toString())){
          client.user = username;
          client.type = 'user'
          client.username = username.split('@')[0]
          return callback(null, true)
        }
        else {
          for (var i=0; i < user.devices.length; i++){
            if(user.devices[i].name == client.id){
              if(user.devices[i].token == password.toString()){
                client.user = client.id
                client.type = 'device'
                client.username = username.split('@')[0]
                return callback(null, true)
              }
              else {
                return callback(null, false)
              }
            }
          }
        }
      }
      else {
        return callback(null, false)
      }
    })
  },
  authorizePublish : function(client, topic, payload, callback) {
    if(topic.split('/')[0] === client.username){
      if(client.type == 'user'){
          callback(null, true);
      }
      else if (client.type == 'device' && topic.split('/')[1] === client.id){
        callback(null, true);
      }
      else {
        callback(null, false);
      }
    }
    else {
      callback(null, false);
    }
  },
  authorizeSubscribe : function(client, topic, callback) {
    if(topic.split('/')[0] == client.username){
      callback(null, true);
    }
    else {
      callback(null, false);
    }
  }
}
