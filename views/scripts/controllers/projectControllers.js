'use strict'
var projectControllers = angular.module('projectControllers', []);
projectControllers.controller('ProjectListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    $http.get('/api/projects').success(function(data) {
        $scope.projects = angular.fromJson(data);
    });
}]);

projectControllers.controller('ProjectCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', function($scope, $http, $location, $route, $routeParams) {
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
        $scope.project = angular.fromJson(data);
        $http.get('/api/issuesOfProject/' + $scope.project._id).success(function(data) {
            $scope.issues = angular.fromJson(data);
            $scope.projectForm.name = $scope.project.name;
            $scope.projectForm.shortName = $scope.project.shortName;
        });
    });

}]);



projectControllers.controller("addProjectModalController", ['$scope', '$uibModal',

    function($scope, $uibModal) {

        $scope.showForm = function() {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);

            var modalInstance = $uibModal.open({
                templateUrl: '/app/layouts/modals/addProjectModal.html',
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
