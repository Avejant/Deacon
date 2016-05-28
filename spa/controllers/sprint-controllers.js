'use strict'
var app = angular.module('deaconApp');

app.controller('backlogCtrl', ['$scope', '$location', '$http', '$route', '$routeParams', function($scope, $location, $http, $route, $routeParams) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }
    $http.get('/api/projects/' + $routeParams.id).success(function(data) {
        $scope.project = data;
        if ($scope.project.sprints.length == 0) {
            $location.path('/');
            return;
        }

        $scope.activeSprint = $scope.project.sprints[$scope.project.sprints.length - 1];
        $scope.activeSprint.totalPoints = 0;
        $scope.backlog = {};
        $scope.toogleSprint = function(issueId) {
            $http.post('/api/issues/' + issueId + '/toogleSprint').success(function(data) {
                $route.reload();
            });
        }
        $http.get('/api/projects/' + $scope.project._id + '/issues').success(function(data) {
            var issues = angular.fromJson(data);
            $scope.activeSprint.issues = issues.filter(function(item) {
                if (item.sprint === null) {
                    return false;
                }
                return item.sprint._id === $scope.activeSprint._id;
            });

            $scope.activeSprint.totalPoints = $scope.activeSprint.issues.reduce(function(sum, issue) {
                return sum + issue.storyPoints;
            }, 0);

            $scope.backlog.issues = issues.filter(function(item) {
                return item.sprint === null;
            });

            $scope.backlog.totalPoints = $scope.backlog.issues.reduce(function(sum, issue) {
                return sum + issue.storyPoints;
            }, 0);

        });
    });
}]);

app.controller('activeSprintCtrl', ['$scope', '$location', '$http', '$route', '$routeParams', function($scope, $location, $http, $route, $routeParams) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $scope.updateStatus = function(statusName, issueId) {
        $http.put('/api/issues/' + issueId + '/updateStatus', {
            statusName: statusName
        }).success(function(data) {
            $scope.editable = false;
            $route.reload();
        });
    }

    $http.get('/api/projects/' + $routeParams.id).success(function(data) {
        $scope.project = angular.fromJson(data);
        $scope.sprint = $scope.project.sprints[$scope.project.sprints.length - 1];
        $http.get('/api/sprint/' + $scope.sprint._id + '/issues').success(function(data) {
            $scope.sprint.todo = data.filter(function(issue) {
                return issue.status.name === "Open";
            });

            $scope.sprint.inprog = data.filter(function(issue) {
                return issue.status.name === "In Progress";
            });

            $scope.sprint.resolved = data.filter(function(issue) {
                return issue.status.name === "Resolved";
            });

            $scope.sprint.closed = data.filter(function(issue) {
                return issue.status.name === "Closed";
            });
        });
    });
    //
    // $scope.sprint.todo = ['1', '2', '3'];
    // $scope.sprint.inprog = ['4', '66'];
    // $scope.sprint.resolved = ['4', '66', '2', '3'];
    // $scope.sprint.closed = [];

}]);

app.controller('addSprintModalController', ['$scope', '$uibModal',

    function($scope, $uibModal) {

        $scope.showForm = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/spa/partials/modals/addSprintModal.html',
                controller: AddSprintModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    sprintForm: function() {
                        return $scope.sprintForm;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {});
        };
    }
]);

var AddSprintModalInstanceCtrl = function($scope, $uibModalInstance, $http, $location, $route, sprintForm) {
    $scope.$watch('sprintForm', function(sprintForm) {
        if (sprintForm) {
            $scope.durations = [{
                name: '2 weeks',
                value: 14
            }, {
                name: '1 month',
                value: 28
            }];
            $scope.updateEndingDate = function() {
                var temp = new Date();
                var beg = $scope.sprintForm.beginning;
                temp.setDate(beg.getDate() + $scope.duration.value);
                $scope.sprintForm.ending = temp;
            }

            $scope.duration = $scope.durations[0];
            $scope.sprintForm.beginning = new Date();
            $scope.sprintForm.ending = new Date();
            $scope.sprintForm.ending.setDate($scope.sprintForm.beginning.getDate() + 14);
            $scope.addSprint = function() {
                console.log($scope.sprintForm);
                if ($scope.sprintForm.$valid) {
                    $scope.messages = [];
                    $scope.project = $scope.$parent.$parent.project;
                    $http.post('/api/projects/' + $scope.project._id + '/startSprint', $scope.sprintForm).success(function(data) {
                        $route.reload();
                        $uibModalInstance.close('closed');
                    }).error(function(data) {
                        $location.path('/');
                    })
                }
            }

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    });

}
