'use strict'
var issueController = angular.module('issueControllers',[]);

issueController.controller('IssueCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    if (!$scope.$parent.isAuthenticated) 
    {
        $location.path('/');
        return;
    }

    $http.get('/api/issues/'+ $routeParams.id).success(function(data) {
        $scope.issue = angular.fromJson(data); 
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