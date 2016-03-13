'use strict'
var app = angular.module('deaconApp',['ngRoute', 'projectControllers','ui.bootstrap']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
            when('/',{templateUrl:'/app/layouts/main.html', controller:'AppCtrl'}).
			when('/projects', { templateUrl: '/app/layouts/projects.html', controller: 'ProjectListCtrl' }).
            when('/projects/:id',{templateUrl: '/app/layouts/project.html', controller: 'ProjectCtrl'}).
			when('/login', {templateUrl: '/app/layouts/login.html', controller:'LoginCtrl'}).
            when('/signup',{templateUrl:'/app/layouts/signup.html', controller:'SignupCtrl'}).
            when('/myProfile',{templateUrl:'/app/layouts/profile.html', controller:'CurrentUserProfileCtrl'}).
			otherwise({ redirectTo: '/' });
	}]);

app.controller('MainCtrl',['$scope','$http',function($scope, $http) {
    $scope.isUserHasRole = function(rolename) {
      if ($scope.user) {      return $scope.user.role.name === rolename;  }
      return false;
    };
}]);

//main page ctrl
app.controller('AppCtrl',['$scope','$http',function($scope, $http) {
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
        $scope.$parent.isAuthenticated = data.isAuthenticated; 
        $scope.$parent.user = data.user;
    });
}]);

//login ctrl
app.controller('LoginCtrl',['$scope', '$http','$location', function($scope, $http, $location) {
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
app.controller('SignupCtrl',['$scope', '$http','$location', function($scope, $http, $location) {
        console.log($scope.$parent.isAuthenticated);
        if ($scope.$parent.isAuthenticated) 
        {
            $location.path('/');
            return;
        }

        $scope.validateForm = function() {
            if (!$scope.comparePasswordAndConfirmation && checkPasswordFormat) 
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        $scope.checkPasswordFormat = function() {
            var regex = new RegExp("^[a-zA-Z]\w{3,14}$");    
            return  $scope.formData.password.match(regex);
        }

        $scope.comparePasswordAndConfirmation = function() {
            return $scope.formData.password === $scope.formData.confPassword;    
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
app.controller('CurrentUserProfileCtrl',['$scope', '$http', '$location', function($scope, $http, $location){
    $http.get('/currentUser').success(function(data) {
       if (!data.user)
       {
        $location.path('/');
       }
       $scope.user = data.user;
    });

}]);
