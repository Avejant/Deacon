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
  $scope.query = "";
  $scope.fields = [{
      value: 0,
      name: ''
  }, {
      value: 1,
      name: 'Issue name'
  }, {
      value: 2,
      name: 'Project'
  }, {
      value: 3,
      name: 'Reporter'
  }, {
      value: 4,
      name: 'Status'
  }, {
      value: 5,
      name: 'Issue Type'
  }, {
      value: 6,
      name: 'Severity'
  }];
  $scope.field = 0;
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
