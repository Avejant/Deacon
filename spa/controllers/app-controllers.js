'use strict'
var app = angular.module('deaconApp');

app.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.isUserHasRole = function(rolename) {
        if ($scope.user) {
            return $scope.user.role.name === rolename;
        }
        return false;
    };
}]);

//main page ctrl
app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
        $scope.$parent.isAuthenticated = data.isAuthenticated;
        $scope.$parent.user = data.user;
        if ($scope.isAuthenticated) {
          $http.get('/api/user/' + data.user._id + '/assignedIssues').success(function(data) {
              $scope.issues = data;
          });
        }
    });
}]);
