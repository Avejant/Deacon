'use strict'
var app = angular.module('deaconApp');

app.controller('backlogCtrl', ['$scope', '$location', function($scope, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $scope.project = {
        name: 'Open SPA',
        _id: '570eaaf95d1208181c953620'
    };
    $scope.backlog = {
        totalPoints: 122
    };

    $scope.activeSprint = {
        name: 'SPA-17',
        totalPoints: 111
    };

    $scope.activeSprint.issues = [{
        _id: 12,
        name: 'Issue 1',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 55',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 44',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 99',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }];
    $scope.backlog.issues = [{
        _id: 12,
        name: 'Issue 3',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 4',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 5',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }, {
        _id: 12,
        name: 'Issue 6',
        issueType: 'Bug',
        storyPoints: 5,
        status: 'In Progress',
        severity: 'Normal',
        assigneeUser: 'maria.muravyova'
    }];
}]);

app.controller('activeSprintCtrl', ['$scope', '$location', function($scope, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $scope.sprint = {
        name: 'SPA-17'
    };

    $scope.sprint.todo = ['1', '2', '3'];
    $scope.sprint.inprog = ['4', '66'];
    $scope.sprint.resolved = ['4', '66', '2', '3'];
    $scope.sprint.closed = [];

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
