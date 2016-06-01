'use strict'
var app = angular.module('deaconApp');
app.controller('ProjectListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }
    $scope.query = "";
    $scope.fields = [{
        value: 1,
        name: 'Name'
    }, {
        value: 2,
        name: 'Short name'
    }, {
        value: 3,
        name: 'Project manager'
    }];
    $scope.field = 1;
    $http.get('/api/projects').success(function(data) {
        $scope.projects = angular.fromJson(data);
    });
}]);

app.controller('ProjectCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', function($scope, $http, $location, $route, $routeParams) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $http.get('/api/projects/' + $routeParams.id).success(function(data) {
        $scope.update = function() {
            console.log($scope.projectForm);
            if ($scope.projectForm.$valid) {
                $http.put('/api/projects/' + $scope.project._id, $scope.projectForm).success(function(data) {
                    $scope.messages = [];
                    if (data.nameError || data.shortNameError) {
                        if (data.nameError) {
                            $scope.messages.push('Project with the same name already exists.');
                        }

                        if (data.shortNameError) {
                            $scope.messages.push('Project with the same short name already exists.');
                        }
                    } else {
                        $scope.editable = false;
                        $route.reload();
                    }
                });
            }
        }

        $scope.cancel = function() {
            $scope.editable = false;
            $route.reload();
        }

        $scope.delete = function() {
            $http.delete('/api/projects/' + $scope.project._id).success(function(data) {
                $location.path('/projects');
            });
        }

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

        $scope.project = angular.fromJson(data);
        if ($scope.project.sprints.length == 0) {
            $scope.activeSprint = {
                name: "No sprints"
            };
        } else {
            $scope.activeSprint = $scope.project.sprints[$scope.project.sprints.length - 1];
        }


        $http.get('/api/projects/' + $scope.project._id + '/issues').success(function(data) {
            $scope.issues = angular.fromJson(data);
            $scope.projectForm.name = $scope.project.name;
            $scope.projectForm.shortName = $scope.project.shortName;

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
                name: 'Assignee user'
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
    });

}]);



app.controller("addProjectModalController", ['$scope', '$uibModal',

    function($scope, $uibModal) {

        $scope.showForm = function() {
            $scope.message = "Show Form Button Clicked";

            var modalInstance = $uibModal.open({
                templateUrl: '/spa/partials/modals/addProjectModal.html',
                controller: AddProjectModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    projectForm: function() {
                        return $scope.projectForm;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {});
        };
    }
]);

var AddProjectModalInstanceCtrl = function($scope, $uibModalInstance, $http, $location, projectForm) {
    $scope.addProject = function() {
        $scope.projectForm.projectManager = $scope.user;
        $scope.messages = [];
        if ($scope.projectForm.$valid) {
            $http.post('/api/projects', $scope.projectForm).success(function(data) {

                if (data.nameError || data.shortNameError) {
                    if (data.nameError) {
                        $scope.messages.push('Project with the same name already exists.');
                    }

                    if (data.shortNameError) {
                        $scope.messages.push('Project with the same short name already exists.');
                    }
                } else {
                    $location.url('/projects/');
                    $uibModalInstance.close('closed');
                }

            }).error(function(data) {
                $location.path('/');
            })
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
