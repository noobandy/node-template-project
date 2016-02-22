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

                    $state.go("dashboard");

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

App.controller("UIController", ["$stateParams", "$scope", function ($stateParams, $scope) {

    $scope.activeUI = $stateParams.id;
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

App.controller("DashboardController", ["$scope",function($scope) {

    $scope.alerts = [];

    $scope.closeAlert = function(alert) {
      $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
    };

    $scope.todos = [];

    $scope.newTodo = {};

    $scope.syncRequired = false;

    $scope.addTodo = function(newTodo) {

        $scope.syncRequired = true;

        $scope.todos.unshift({title : newTodo.title, description : newTodo.description, dueDate : newTodo.dueDate});

        $scope.alerts.unshift({
            type: "success",
            message: "Task added successfully."
        });
    };

    $scope.syncInProgress = false;

    $scope.syncTaskList = function() {
        $scope.syncInProgress = true;

    };
}]);


