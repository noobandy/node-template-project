"use strict";

angular.module("App").config(["$stateProvider", "$urlRouterProvider", 
	function($stateProvider, $urlRouterProvider) {
	
	// For any unmatched url, redirect to /
  	$urlRouterProvider.otherwise("/");

	$stateProvider.state({
		name : "home",
		url : "/",
		templateUrl : "/public/app/templates/home.html",
		controller : "HomeController",
		data : {
			secure : false
		}
	}).state({
		name : "about",
		url : "/about",
		templateUrl : "/public/app/templates/about.html",
		controller : "AboutController",
		data : {
			secure : false
		}
	}).state({
		name : "contact",
		url : "/contact",
		templateUrl : "/public/app/templates/contact.html",
		controller : "ContactController",
		data : {
			secure : false
		}
	}).state({
		name : "ui components",
        url : "/ui?id",
        templateUrl : "/public/app/templates/ui.html",
        controller : "UIController",
        data : {
            secure : false
        }
	}).state({
		name : "forgot password",
		url : "/forgotpassword",
		templateUrl : "/public/app/templates/forgotpassword.html",
		controller : "ForgotPasswordController",
		data : {
			secure : false
		}
	}).state({
		name : "change password",
		url : "/changepassword",
		templateUrl : "/public/app/templates/changepassword.html",
		controller : "ChangePasswordController",
		data : {
			secure : true
		}
	}).state({
        name : "dashboard",
		url : "/dashboard",
		templateUrl : "/public/app/templates/dashboard.html",
		controller : "DashboardController"
	});
}]);



//ensure that user is authecticate before state change for secure states
App.run(["$rootScope", "AuthenticationManager",
	function($rootScope, AuthenticationManager) {
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			if(toState.data && toState.data.secure  && !AuthenticationManager.isAuthenticated()) {
				event.preventDefault();
			}
		});
	}]);