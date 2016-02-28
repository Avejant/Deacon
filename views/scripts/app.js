'use strict'
var app = angular.module('deaconApp',['ngRoute','appController','projectControllers','services'])
    .run(['AuthenticationService', function(AuthenticationService) {
        // Get the current user when the application starts
        // (in case they are still logged in from a previous session)
        AuthenticationService.requestCurrentUser();
    }]).
    run(function($rootScope, $location, AuthenticationService) {
        // put logout() on rootscope so can be accessed anywhere
        $rootScope.logout = function() {
            var logout = AuthenticationService.logout();
            logout.then(function() {
                $location.path('/login');
            });
            return logout;
        };
    }).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/api/projects', { templateUrl: '/app/layouts/projects.html', controller: 'ProjectListCtrl' }).
			when('/login', {templateUrl: '/app/layouts/login.html'}).
			otherwise({ redirectTo: '/' });
	}]);

