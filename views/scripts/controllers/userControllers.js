'use strict'
var userController = angular.module('userControllers',[]);

userController.controller('UserListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
	if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }

    if($scope.$parent.user.role.name !== "admin")
    {
    	$location.path('/');
        return;
    }

    $http.get('/api/users').success(function(data) {
        $scope.users = angular.fromJson(data); 
    });
}]);