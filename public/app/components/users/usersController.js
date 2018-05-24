app.controller('usersController', function($scope, users) {
   $scope.findUser = function(username) {
     $scope.output = true;
     if(!username){
       $scope.result = {
         status : "error",
         message : "User Not Found"
       }
     }
     else {
       users.find({user:username}, function(result){
         console.log(result)
         $scope.result = result
       }, function(error){
         $scope.result = {
           status : "error",
           message : "User Not Found"
         }
       })
     }
   }
})
