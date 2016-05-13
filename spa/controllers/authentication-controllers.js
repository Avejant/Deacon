'use strict'
var authenticationController = angular.module('authenticationControllers', ['ngFileUpload']);
//login ctrl
authenticationController.controller('LoginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if ($scope.$parent.isAuthenticated) {
        $location.path('/');
    }
    $scope.submit = function() {
        $http.post('/login', $scope.formData).
        success(function(data) {
            if (data.messages) {
                $scope.messages = data.messages;
            } else {
                $location.path('/');
            }
        }).error(function(data) {
            console.error('error in posting');
        })
    }
}]);

//signup ctrl
authenticationController.controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if ($scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $http.get('/signup').success(function(data) {
        $scope.roles = data.roles;
        $scope.formData = {};
        $scope.formData.choosenRole = $scope.roles[0];
    });

    $scope.submit = function() {
        $http.post('/signup', $scope.formData).
        success(function(data) {
            if (data.messages) {
                $scope.messages = data.messages;
            } else {
                $location.path('/');
            }
        }).error(function(data) {
            console.error('error in posting');
        })
    }
}]);
