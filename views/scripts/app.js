'use strict'
var app = angular.module('deaconApp',['ngRoute', 'projectControllers']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
            when('/',{templateUrl:'/app/layouts/main.html', controller:'AppCtrl'}).
			when('/api/projects', { templateUrl: '/app/layouts/projects.html', controller: 'ProjectListCtrl' }).
			when('/login', {templateUrl: '/app/layouts/login.html', controller:'LoginCtrl'}).
            when('/signup',{templateUrl:'/app/layouts/signup.html', controller:'SignupCtrl'}).
			otherwise({ redirectTo: '/' });
	}]);

//main page ctrl
app.controller('AppCtrl',['$scope','$http',function($scope, $http) {
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
    });
}]);

//login ctrl
app.controller('LoginCtrl',['$scope', '$http','$location', function($scope, $http, $location) {
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