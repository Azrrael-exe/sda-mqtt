var passport = require('passport')
var jwt = require('jsonwebtoken');
var secret = process.env.TOKEN_SECRET || 'superSecret';
var User = require('../models/user')

module.exports = {
  verifyToken : function (req, res, next){
    var token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (!decoded) {
          res.status(401)
          res.json({
            message : 'Invalid or expired token'
          })
        }
        else {
          var decoded = jwt.decode(token, secret);
          req.decoded = decoded;
          User.findOne({email : req.decoded._doc.email}, function(err, user){
            if(user){
              req.user = user
              next();
            }
            else {
              res.status(401)
              res.json({
                message : 'no token provided'
              })
            }
          })
        }
      });
    }
    else{
      res.status(401)
      res.json({
        message : 'no token provided'
      })
    }
  }
}
