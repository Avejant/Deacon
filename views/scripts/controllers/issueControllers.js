'use strict'
var issueController = angular.module('issueControllers',[]);
projectControllers.controller('IssueListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }


    $http.get('/api/issues').success(function(data) {
        $scope.issues = angular.fromJson(data); 
    });
}]);

issueController.controller('IssueCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', function ($scope, $http, $location, $route, $routeParams) {
    if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }

    $http.get('/api/issues/'+ $routeParams.id).success(function(data) {
        $scope.update = function()
        {
          if ($scope.issueForm.$valid) {
            $http.put('/api/issues/' + $scope.issue._id, $scope.issueForm).success(function(data) {
              $scope.editable = false;
              $route.reload();
            });
          }
        }

        $scope.issue = angular.fromJson(data); 
        $scope.issueForm.name = $scope.issue.name;
        $scope.issueForm.description = $scope.issue.description;
            $http.get('/api/severities').success(function(data) {
                $scope.severities = angular.fromJson(data);
                $scope.issueForm.severity = $scope.severities.find(function(item){return  item._id === $scope.issue.severity._id});
                $http.get('/api/issueTypes').success(function(data) {
                    $scope.issueTypes = angular.fromJson(data);
                    $scope.issueForm.issueType = $scope.issueTypes.find(function(item){return  item._id === $scope.issue.issueType._id});
                    $http.get('/api/users').success(function(data) {
                        $scope.users = angular.fromJson(data); 
                        $scope.issueForm.assigneeUser = $scope.users.find(function(item){return  item._id === $scope.issue.assigneeUser._id});
                });
            });
        });
    });
}]);


issueController.controller('addIssueModalController', ['$scope', '$uibModal',

    function ($scope, $uibModal) {

        $scope.showForm = function () {
            $scope.message = "Show Form Button Clicked";

            var modalInstance = $uibModal.open({
                templateUrl: '/app/layouts/modals/addIssueModal.html',
                controller: AddIssueModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    issueForm: function () {
                        return $scope.issueForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };
}]);

var AddIssueModalInstanceCtrl = function ($scope, $uibModalInstance, $http, $location, issueForm) {
    $http.get('/api/issueTypes').success(function(data) {
        $scope.issueForm.description = "";
        $scope.issueTypes = angular.fromJson(data);
        $scope.issueForm.issueType = data[0]; 
        $http.get('/api/severities').success(function(data) {
            $scope.issueForm.severity = data[0]; 
            $scope.severities = angular.fromJson(data);
            $http.get('/api/users').success(function(data) {
                $scope.users = angular.fromJson(data);
                console.log(data);
                $scope.issueForm.assigneeUser = data[0];
                $http.get('/api/projects').success(function(data) {
                    $scope.projects = angular.fromJson(data);
                    $scope.issueForm.project = $scope.projects.find(function(item){return  item._id === $scope.$parent.$parent.project._id});
                    if (!$scope.issueForm.project) 
                    {
                        $scope.issueForm.project = $scope.projects[0];
                    }
                });
            })
        });
    });


    $scope.addIssue = function () {
    	$scope.issueForm.reporter = $scope.user;
    	if ($scope.issueForm.$valid) {
			$http.post('/api/issues', $scope.issueForm).success(function(data) {
                $location.url('/');
                $uibModalInstance.close('closed');
        	}).error(function(data) {
           		$location.path('/');
        	})
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};