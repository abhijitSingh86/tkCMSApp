var mainApplicationModuleName = 'conference-system';
var mainApplicationModule = angular.module(mainApplicationModuleName
    , ['registrationModule','authenticationServiceModule','loginModule','ngMaterial',  'ngMessages', 'ngRoute']);

mainApplicationModule.config(function($routeProvider) {
    $routeProvider
    // route for the home page
        .when('/forget-pass', {
            templateUrl : '/views/forgot_pass.html',
            controller: 'ResetPasswordCtrl'
        })
        .when('/register', {
            templateUrl : '/views/registration.html',
            controller: 'RegistrationFormController'
        })
        .when('/', {
        templateUrl : '/views/home.html',
        //controller: 'ResetPasswordCtrl'
    })
        .when('/login', {
            templateUrl : '/views/index.ejs',
            controller: 'LoginController'
        })
});
angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});
/*
mainApplicationModule.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            if (AuthService.isLoggedIn() === false) {
                $location.path('/login');
            }
        });
});*/
