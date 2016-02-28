'use strict'
var projectControllers = angular.module('projectControllers',[]);
projectControllers.controller('ProjectListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
	$http.get($location.$$path).success(function(data) {
      	$scope.polls = angular.fromJson(data); 
  	});
}]);
