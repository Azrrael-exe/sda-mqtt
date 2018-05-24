app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'app/components/users/usersView.html',
    controller  : 'usersController'
  })
  .when('/devices', {
    templateUrl : 'app/components/devices/devicesView.html',
    controller  : 'devicesController'
  })
});
