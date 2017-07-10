module.exports = {
  resHandler : function (req, res, next) {
    if(res.payload){
      var response = {}
      response['status'] = 'ok'
      response['message'] = res.message
      if(res.payload.length){
        response['payload'] = res.payload
      } else {
        response['payload'] = [res.payload]
      }
      response['count'] = response.payload.length
      res.send(response)
    }
    else{
      var err = new Error('Resource not found');
      err.status = 404;
      err.message = "Resource not found"
      next(err);
    }
  },
  errHandler : function (err, req, res, next){
    res.status(err.status || 500)
    response = {}
    response['status'] = 'error'
    response['code'] = err.status || 500
    response['message'] = err.message || 'Internal server error'
    res.send(response)
  }
}
