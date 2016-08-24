var mainApplicationModuleName = 'conference-system';
var mainApplicationModule = angular.module(mainApplicationModuleName
    , ['leftPanelModule','authenticationServiceModule','loginModule','eventsModule','ngMaterial',  'ngMessages', 'ngRoute','ui.router', 'ngCookies', 'vAccordion']);

mainApplicationModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            views: {
                'header': {
                    templateUrl: 'views/partials/header.html'
                },
                'leftpanel': {
                    templateUrl: 'views/partials/accordianPanel.html',
                    controller: 'LeftPanelController'
                },
                'mainpanel': {
                    templateUrl: 'views/partials/content.html'
                },
                'footer': {
                    templateUrl: 'views/partials/footer.html'
                }
            },
            resolve: {
                auth: function (AuthService, $q, $rootScope) {
                    var deferred = $q.defer();
                    if (!AuthService.isLoggedIn()) {
                        deferred.reject({redirectTo: 'login'});
                    } else {
                        deferred.resolve({});
                    }
                    return deferred.promise;
                }
            }
        })
        .state('home.event', {
            url: 'event/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/event.html',
                    controller: 'EventController'
                }
            },

        })
        .state('home.newevent', {
            url: 'event',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/eventform.html',
                    controller: 'EventController'
                }
            },

        })
        .state('login', {
            url:'/login',
            views: {
                'mainpanel': {
                    templateUrl: 'views/login.html'
                }
            },
            controller: 'LoginController',
            resolve: {
                auth: function (AuthService, $q, $rootScope) {
                    var deferred = $q.defer();
                    if (AuthService.isLoggedIn()) {
                        deferred.reject({redirectTo: 'home'});
                    } else {
                        deferred.resolve({});
                    }
                    return deferred.promise;
                }
            }
        })

}]);
mainApplicationModule.run(function ($rootScope, AuthService, $state) {
    if(AuthService.isLoggedIn()){
        $rootScope.currentUser = true;
    } else {
        $rootScope.currentUser = false;
    }
    $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
        if (error.redirectTo) {
            $state.go(error.redirectTo);
        } else {
            $state.go('error', {status: error.status})
        }
    })
});
angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});

