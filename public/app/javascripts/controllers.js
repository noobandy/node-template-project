"use strict";

var App = angular.module("App");

App.controller("NavbarController", ["$scope", "AuthenticationManager", "$state",
    function ($scope, AuthenticationManager, $state) {

        function newLoginModel() {
            return {
                username: "",
                password: "",
                wrongCredentials: false
            };
        }

        $scope.loginModel = newLoginModel();

        $scope.login = function () {
            AuthenticationManager.authenticate($scope.loginModel.username,
                $scope.loginModel.password).then(function (success) {

                    $scope.loginModel = newLoginModel();

                    $state.go("auth success");

                }, function (error) {
                    $scope.loginModel.wrongCredentials = true;
                });
        };


        $scope.logout = function () {
            AuthenticationManager.logout();
            $state.go("home");
        };

    }]);


App.controller("HomeController", ["$scope", "User", "$state",
    function ($scope, User, $state) {
        $scope.alerts = [];

        function newRegistrationModel() {
            return {
                emailId: "",
                username: "",
                password: "",
                repeatPassword: "",
                usernameAvailable: true
            };
        }

        $scope.registrationModel = newRegistrationModel();

        $scope.regisetr = function () {
            User.register($scope.registrationModel.emailId, $scope.registrationModel.username,
                $scope.registrationModel.password).
                then(function (data) {

                    $scope.alerts.unshift({
                        type: "success",
                        message: "User registered successfully. Check your mail for further instructions"
                    });

                }, function (error) {
                    $scope.alerts.unshift({
                        type: "danger",
                        message: "User registration failed. Please retry after sometime"
                    });
                });
        };
    }]);


App.controller("AboutController", ["$scope",
    function ($scope) {

    }]);


App.controller("ContactController", ["$scope",
    function ($scope) {

    }]);

App.controller("UIController", ["$stateParams", "$scope", "Upload", "AppConfig", function ($stateParams, $scope, Upload, AppConfig) {

    $scope.activeUI = $stateParams.id;

    $scope.fileupload = {
        uploaded : false,
        uploadPath : null,
        file : null,
        // upload later on form submit or something similar
        submit: function () {
            if ($scope.fileupload.file) {
                $scope.fileupload.upload($scope.fileupload.file);
            }
        },
        // upload on file select or drop
        upload: function (file) {
            Upload.upload({
                url: AppConfig.basePath + 'uploads',
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + JSON.stringify(resp.data));
                $scope.fileupload.uploaded = true;
                $scope.fileupload.uploadPath = AppConfig.basePath + "uploads/"+resp.data._id+"/data";
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        }
    }
}]);

App.controller("ForgotPasswordController", ["$scope", "User",
    function ($scope, User) {
        $scope.username = "";

        $scope.alerts = [];

        $scope.sendPasswordResetLink = function () {
            User.sendPasswordResetLink($scope.username).then(function (result) {
                if (result.data.success) {
                    $scope.alerts.unshift({
                        type: "success",
                        message: "Follow password reset instructions send to your registered email."
                    });
                } else {
                    $scope.alerts.unshift({type: "danger", message: "User not found"});
                }
            }, function (error) {
                $scope.alerts.unshift({type: "danger", message: "request failed please try later"});
            })
        }
    }]);

App.controller("ChangePasswordController", ["$scope", "$rootScope", "User", "AuthenticationManager", "$state",
    function ($scope, $rootScope, User, AuthenticationManager, $state) {
        function newPasswordChangeModel() {
            return {
                oldPassword: "",
                password: "",
                repeatPassword: "",
                wrongCredentials: false
            };
        }

        $scope.alerts = [];

        $scope.passwordChangeModel = newPasswordChangeModel();

        $scope.changePassword = function () {
            User.changePassword($rootScope.authenticatedUser, $scope.passwordChangeModel.oldPassword, $scope.passwordChangeModel.password).then(function (result) {
                if (result.data.success) {
                    $scope.alerts.unshift({
                        type: "success",
                        message: "Password Changed Successfully. Login using new password."
                    });

                    AuthenticationManager.logout();

                    $state.go("home");

                } else {
                    $scope.passwordChangeModel.wrongCredentials = true;
                }

            });
        };


    }]);
