var mosca = require('mosca');

var auth = require('./auth')

var ascoltatore = {
  type: 'mongo',
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};
var settings = {
  port: 1883,
  backend: ascoltatore
};
var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client){
  console.log(client.id + ' disconected')
})

server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
});

server.on('subscribed', function(client, topic){
  console.log('subscribed')
})

server.on('unsuscribed', function(client, topic){
  console.log('unsuscribed')
})

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  server.authenticate = auth.authenticate;
  server.authorizePublish = auth.authorizePublish;
  server.authorizeSubscribe = auth.authorizeSubscribe;
}

module.exports = server
