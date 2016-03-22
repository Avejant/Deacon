'use strict'
var appController = angular.module('appControllers',[]);

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
appController.controller('UserProfileCtrl',['$scope', '$http', '$location','$routeParams', function($scope, $http, $location, $routeParams){
    if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }

    $http.get('/api/users/' + $routeParams.id).success(function(data) {
       $scope.isYourOwnProfile = data._id === $scope.user._id;
       if (!data)
       {
        $location.path('/');
       }
       $scope.user = data;
    });

}]);