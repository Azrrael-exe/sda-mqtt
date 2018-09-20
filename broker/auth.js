module.exports = {
  authenticate : function(client, username, password, callback) {
    console.log({
      client : client,
      username : username,
      password : password.toString()
    })
    return callback(null, true)
  },
  authorizePublish : function(client, topic, payload, callback) {
    console.log({
      client : client,
      topic : topic,
      payload : payload
    })
    return callback(null, true)
  },
  authorizeSubscribe : function(client, topic, callback) {
    console.log({
      client : client,
      topic : topic
    })
    return callback(null, true)
  }
}
