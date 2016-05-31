'use strict'
var app = angular.module('deaconApp');

app.controller('UserListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }

    if ($scope.$parent.user.role.name !== "admin") {
        $location.path('/');
        return;
    }

    $http.get('/api/users').success(function(data) {
        $scope.users = angular.fromJson(data);
    });
}]);


//current user profile ctrl
app.controller('UserProfileCtrl', ['$scope', '$http', '$location', '$routeParams', '$route', 'Upload', function($scope, $http, $location, $routeParams, $route, Upload) {
    if (!$scope.$parent.isAuthenticated) {
        $location.path('/');
        return;
    }
    $scope.form = {};
    $scope.editable = false;
    $scope.cancel = function() {
        $scope.editable = false;
    }

    $scope.update = function() {
        $http.put('/api/users/' + $scope.profileUser._id, $scope.userForm).success(function(data) {
            $scope.editable = false;
            $route.reload();
        });
    }

    $scope.changePassword = function() {
        $scope.messages = [];
        $scope.passwordChangeMessage = null;
        if ($scope.form.passwordForm.newPass !== $scope.form.passwordForm.confPass) {
            $scope.messages.push('Confirmation does not match password');
        } else {
            $http.put('/api/users/' + $routeParams.id + '/changePassword', $scope.form.passwordForm).success(function(data) {
                if (data.errorMessage) {
                    $scope.messages.push(data.errorMessage);
                } else {
                    $scope.passwordChangeMessage = "Password was successfully changed";
                    $scope.form.passwordForm.oldPass = $scope.form.passwordForm.newPass = $scope.form.passwordForm.confPass = "";
                }
            })
        }

    }

    $scope.upload = function() {
        Upload.upload({
            url: 'api/upload/avatar',
            method: 'post', //webAPI exposed to upload the file
            data: {
                file: $scope.file
            } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                $route.reload();
            } else {
                console.log('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
        }, function(evt) {});
    };

    $http.get('/api/users/' + $routeParams.id).success(function(data) {

        if (!data) {
            $location.path('/');
        }
        $scope.profileUser = data;
        $scope.userForm.firstName = data.firstName;
        $scope.userForm.lastName = data.lastName;
        $scope.userForm.email = data.email;
        $scope.userForm.location = data.location;
        $scope.isYourOwnProfile = $scope.profileUser._id === $scope.user._id;
    });

}]);
