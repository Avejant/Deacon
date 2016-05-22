'use strict'
var app = angular.module('deaconApp', ['ngRoute', 'ngFileUpload','ui.bootstrap']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/spa/partials/home.html',
        controller: 'HomeCtrl'
    }).
    when('/projects', {
        templateUrl: '/spa/partials/projects.html',
        controller: 'ProjectListCtrl'
    }).
    when('/projects/:id', {
        templateUrl: '/spa/partials/project.html',
        controller: 'ProjectCtrl'
    }).
    when('/issues', {
        templateUrl: '/spa/partials/issues.html',
        controller: 'IssueListCtrl'
    }).
    when('/issues/:id', {
        templateUrl: '/spa/partials/issue.html',
        controller: 'IssueCtrl'
    }).
    when('/login', {
        templateUrl: '/spa/partials/login.html',
        controller: 'LoginCtrl'
    }).
    when('/signup', {
        templateUrl: '/spa/partials/signup.html',
        controller: 'SignupCtrl'
    }).
    when('/profile/:id', {
        templateUrl: '/spa/partials/profile.html',
        controller: 'UserProfileCtrl'
    }).
    when('/users', {
        templateUrl: '/spa/partials/userList.html',
        controller: 'UserListCtrl'
    }).
    when('/project/:id/backlog',{
       templateUrl: '/spa/partials/backlog.html',
       controller: 'backlogCtrl'
    }).
    when('/project/:id/activeSprint',{
      templateUrl:'/spa/partials/activeSprint.html',
      controller: 'activeSprintCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);
