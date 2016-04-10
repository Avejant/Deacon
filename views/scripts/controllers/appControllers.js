'use strict'
var appController = angular.module('appControllers',['ngFileUpload']);

appController.controller('AppCtrl',['$scope','$http',function($scope, $http) {
    $scope.isUserHasRole = function(rolename) {
      if ($scope.user) {      return $scope.user.role.name === rolename;  }
      return false;
    };
}]);

//main page ctrl
appController.controller('HomeCtrl',['$scope','$http',function($scope, $http) {
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
        $scope.$parent.isAuthenticated = data.isAuthenticated; 
        $scope.$parent.user = data.user;
    });
}]);

//login ctrl
appController.controller('LoginCtrl',['$scope', '$http','$location', function($scope, $http, $location) {
        if ($scope.$parent.isAuthenticated) 
        {
            $location.path('/');
        }
        $scope.submit = function() {
        $http.post('/login', $scope.formData).
        success(function(data) {
            if (data.messages) 
            {
                $scope.messages = data.messages;
            }
            else
            {
                $location.path('/');
            }
        }).error(function(data) {
            console.error('error in posting');
        })
    }
}]);

//signup ctrl
appController.controller('SignupCtrl',['$scope', '$http','$location', function($scope, $http, $location) {
        if ($scope.$parent.isAuthenticated) 
        {
            $location.path('/');
            return;
        }

        $http.get('/signup').success(function(data) {
         $scope.roles = data.roles;
         $scope.formData={};
         $scope.formData.choosenRole = $scope.roles[0];
        });

        $scope.submit = function() {
        $http.post('/signup', $scope.formData).
        success(function(data) {
            if (data.messages) 
            {
                $scope.messages = data.messages;
            }
            else
            {
                $location.path('/');
            }
        }).error(function(data) {
            console.error('error in posting');
        })
    }
}]);

//current user profile ctrl
appController.controller('UserProfileCtrl',['$scope', '$http', '$location','$routeParams','$route','Upload', function($scope, $http, $location, $routeParams, $route, Upload){
    if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }

    $scope.upload = function () {
            Upload.upload({
                url: 'api/upload/avatar',
                method:'post', //webAPI exposed to upload the file
                data:{file: $scope.file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $route.reload();
                } else {
                    console.log('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
            }, function (evt) { 
            });
        };
    $http.get('/api/users/' + $routeParams.id).success(function(data) {

       if (!data)
       {
        $location.path('/');
       }
       $scope.profileUser = data;
       $scope.isYourOwnProfile = $scope.profileUser._id === $scope.user._id;
    });

}]);