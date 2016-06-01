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
    $scope.changeFilter = function() {
        var filt = this.field;
        switch (filt) {
            case 4:
                $scope.query.status.name = $scope.statuses[0].name;
                $scope.query.issueType.name = "";
                $scope.query.severity.name = "";
                break;
            case 5:
                $scope.query.issueType.name = $scope.issueTypes[0].name;
                $scope.query.status.name = "";
                $scope.query.severity.name = "";
                break;
            case 6:
                $scope.query.severity.name = $scope.severities[0].name;
                $scope.query.status.name = "";
                $scope.query.issueType.name = "";
                break;
            default:
                $scope.query.status.name = "";
                $scope.query.issueType.name = "";
                $scope.query.severity.name = "";
        }
    }
    $scope.query = {
        issueType: {
            name: ""
        },
        status: {
            name: ""
        },
        severity: {
            name: ""
        }
    };

    $scope.fields = [{
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
    $scope.field = 1;
    $http.get('/currentUser').success(function(data) {
        $scope.isAuthenticated = data.isAuthenticated;
        $scope.user = data.user;
        $scope.$parent.isAuthenticated = data.isAuthenticated;
        $scope.$parent.user = data.user;
        if ($scope.isAuthenticated) {
            $http.get('/api/user/' + data.user._id + '/assignedIssues').success(function(data) {
                $scope.issues = data;
                $http.get('/api/issueTypes').success(function(data) {
                    $scope.issueTypes = data;
                    $http.get('/api/statuses').success(function(data) {
                        $scope.statuses = data;
                        $http.get('/api/severities').success(function(data) {
                            $scope.severities = data;
                        });
                    });
                });
            });
        }
    });
}]);
