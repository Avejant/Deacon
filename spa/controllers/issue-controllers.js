'use strict'
var app = angular.module('deaconApp');
app.controller('IssueListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }


    $http.get('/api/issues').success(function(data) {
        $scope.issues = angular.fromJson(data);
    });
}]);

app.controller('IssueCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', 'Upload', function($scope, $http, $location, $route, $routeParams, Upload) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $http.get('/api/issues/' + $routeParams.id).success(function(data) {
        $scope.update = function() {
            $scope.messages = [];
            if ($scope.issueForm.$valid) {
                $http.put('/api/issues/' + $scope.issue._id, $scope.issueForm).success(function(data) {
                    if (data.nameError) {
                        $scope.messages.push('Issue with the same name already exists.');
                    } else {
                        $scope.editable = false;
                        $route.reload();
                    }
                });
            }
        }

        $scope.updateStatus = function(statusName) {
            $http.put('/api/issues/' + $scope.issue._id + '/updateStatus', {
                statusName: statusName
            }).success(function(data) {
                $scope.editable = false;
                $route.reload();
            });
        }

        $scope.addComment = function() {
            $scope.addCommentForm.issueId = $scope.issue._id;
            $scope.addCommentForm.userId = $scope.user._id;
            $http.post('/api/comments', $scope.addCommentForm).success(function(data) {
                $route.reload();
            });
        }

        $scope.cancel = function() {
            $scope.editable = false;
            $route.reload();
        }
        $scope.upload = function() {
            Upload.upload({
                url: 'api/upload',
                method: 'post', //webAPI exposed to upload the file
                data: {
                    file: $scope.file,
                    issueName: $scope.issue.name
                } //pass file as data, should be user ng-model
            }).then(function(resp) { //upload function returns a promise
                if (resp.data.error_code === 0) { //validate success
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $http.post('/api/attachments/' + $routeParams.id, {
                        filename: resp.data.filename
                    }).success(function(data) {
                        $route.reload();
                    });
                } else {
                    console.log('an error occured');
                }
            }, function(resp) { //catch error
                console.log('Error status: ' + resp.status);
            }, function(evt) {});
        };

        $scope.changeSprint = function() {
          $http.post('/api/issues/' + $routeParams.id+'/toogleSprint').success(function(data) {
                                $route.reload();
          });
        }

        $scope.issue = angular.fromJson(data);
        $scope.sprintButtonName = $scope.issue.sprint === null ? "Add to active sprint" : "Back to backlog";
        $scope.sprint = $scope.issue.sprint === null ? "Backlog" : $scope.issue.sprint.name;
        $scope.showStartProgress = $scope.issue.status.name == "Open";
        $scope.showStopProgress = $scope.issue.status.name == "In Progress";
        $scope.showResolve = $scope.issue.status.name == "In Progress";
        $scope.showReopen = ($scope.issue.status.name == "Closed") || ($scope.issue.status.name == "Resolved");
        $scope.showClose = $scope.issue.status.name == "Resolved";
        $scope.issueForm.name = $scope.issue.name;
        $scope.issueForm.description = $scope.issue.description;
        $scope.issueForm.storyPoints = $scope.issue.storyPoints;
        $http.get('/api/severities').success(function(data) {
            $scope.severities = angular.fromJson(data);
            $scope.issueForm.severity = $scope.severities.find(function(item) {
                return item._id === $scope.issue.severity._id
            });
            $http.get('/api/issueTypes').success(function(data) {
                $scope.issueTypes = angular.fromJson(data);
                $scope.issueForm.issueType = $scope.issueTypes.find(function(item) {
                    return item._id === $scope.issue.issueType._id
                });
                $http.get('/api/users').success(function(data) {
                    $scope.users = angular.fromJson(data);
                    $scope.issueForm.assigneeUser = $scope.users.find(function(item) {
                        return item._id === $scope.issue.assigneeUser._id
                    });
                });
            });
        });
    });
}]);


app.controller('addIssueModalController', ['$scope', '$uibModal',

    function($scope, $uibModal) {

        $scope.showForm = function() {
            $scope.message = "Show Form Button Clicked";

            var modalInstance = $uibModal.open({
                templateUrl: '/spa/partials/modals/addIssueModal.html',
                controller: AddIssueModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    issueForm: function() {
                        return $scope.issueForm;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {});
        };
    }
]);

var AddIssueModalInstanceCtrl = function($scope, $uibModalInstance, $http, $location, $route, issueForm) {
    $http.get('/api/issueTypes').success(function(data) {
        $scope.issueForm.description = "";
        $scope.issueTypes = angular.fromJson(data);
        $scope.issueForm.issueType = data[0];
        $scope.issueForm.storyPoints = 0;
        $http.get('/api/severities').success(function(data) {
            $scope.issueForm.severity = data[0];
            $scope.severities = angular.fromJson(data);
            $http.get('/api/users').success(function(data) {
                $scope.users = angular.fromJson(data);
                $scope.issueForm.assigneeUser = data[0];
                $http.get('/api/projects').success(function(data) {
                    var defaultProject;
                    $scope.projects = angular.fromJson(data);
                    if ($scope.$parent.$parent.project === undefined) {
                        defaultProject = $scope.projects[0];
                    } else {
                        defaultProject = $scope.projects.find(function(item) {
                            return item._id === $scope.$parent.$parent.project._id;
                        });
                    }

                    $scope.issueForm.project = defaultProject;

                    if (!$scope.issueForm.project) {
                        $scope.issueForm.project = $scope.projects[0];
                    }
                });
            })
        });
    });


    $scope.addIssue = function() {
        $scope.issueForm.reporter = $scope.user;
        if ($scope.issueForm.$valid) {
            $scope.messages = [];
            $http.post('/api/issues', $scope.issueForm).success(function(data) {
                if (data.nameError) {
                    $scope.messages.push('Issue with the same name already exists.');
                } else {
                    $route.reload();
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
