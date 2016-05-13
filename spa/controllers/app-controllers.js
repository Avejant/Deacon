'use strict'
var appController = angular.module('appControllers', ['ngFileUpload']);

appController.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.isUserHasRole = function(rolename) {
        if ($scope.user) {
            return $scope.user.role.name === rolename;
        }
        return false;
    };
}]);

//main page ctrl
appController.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
        $scope.$parent.isAuthenticated = data.isAuthenticated;
        $scope.$parent.user = data.user;
    });
}]);
