'use strict'
var app = angular.module('deaconApp',['ngRoute', 'projectControllers','issueControllers','appControllers','ui.bootstrap']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
            when('/',{templateUrl:'/app/layouts/home.html', controller:'HomeCtrl'}).
			when('/projects', { templateUrl: '/app/layouts/projects.html', controller: 'ProjectListCtrl' }).
            when('/projects/:id',{templateUrl: '/app/layouts/project.html', controller: 'ProjectCtrl'}).
            when('/issues', { templateUrl: '/app/layouts/issues.html', controller: 'IssueListCtrl' }).
            when('/issues/:id',{templateUrl: '/app/layouts/issue.html', controller: 'IssueCtrl'}).
			when('/login', {templateUrl: '/app/layouts/login.html', controller:'LoginCtrl'}).
            when('/signup',{templateUrl:'/app/layouts/signup.html', controller:'SignupCtrl'}).
            when('/myProfile',{templateUrl:'/app/layouts/profile.html', controller:'CurrentUserProfileCtrl'}).
			otherwise({ redirectTo: '/' });
	}]);


