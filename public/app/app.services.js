app.factory('users', function($resource){
  return $resource('/users/:user/:device', {}, {
    find : {
      url : '/users/:user',
      method : 'GET',
    },
    list : {
      url : '/users',
      method : 'GET'
    },
    delete : {
      method : 'DELETE'
    }
  })
})

app.factory('user', function($resource, $location){
  var host = $location.host();
  var url = '/getUser'
  return $resource(url, {}, {
    getUser : {
      method : 'GET',
    }
  })
})
