'use strict'
var app = angular.module('deaconApp', ['ngRoute', 'ngFileUpload', 'ui.bootstrap', 'ngCookies', 'pascalprecht.translate', 'tmh.dynamicLocale']).
constant('LOCALES', {
    'locales': {
        'ru_RU': 'Русский',
        'en_US': 'English'
    },
    'preferredLocale': 'en_US'
}).
config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'spa/resources/locale-', // path to translations files
        suffix: '.json' // suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en_US'); // is applied on first load
    $translateProvider.useLocalStorage(); // saves selected language to localStorage
}).
config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
}).
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
    when('/project/:id/backlog', {
        templateUrl: '/spa/partials/backlog.html',
        controller: 'backlogCtrl'
    }).
    when('/project/:id/activeSprint', {
        templateUrl: '/spa/partials/activeSprint.html',
        controller: 'activeSprintCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);
