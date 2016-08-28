var mainApplicationModuleName = 'conference-system';
var mainApplicationModule = angular.module(mainApplicationModuleName
    , ['leftPanelModule','reviewerModule','authenticationServiceModule','loginModule','submissionModule','eventsModule','datatables','ngMaterial',  'ngMessages', 'ngRoute','ui.router', 'ngCookies', 'vAccordion']);

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
        .state('home.events', {
            url: 'events/:filter',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/eventdatatable.html',
                    controller: 'EventController'
                }
            },
            resolve: {
                auth: function (AuthService, $q, $rootScope) {
                    var deferred = $q.defer();
                    /*check if user role is normal user*/
                    if (AuthService.checkUserRole()) {
                        deferred.reject({redirectTo: 'home'});
                    } else {
                        deferred.resolve({});
                    }
                    return deferred.promise;
                }
            }
        })
        .state('home.event.submissions', {
            url: '/submission',
            views: {
                'datatable@home.event': {
                    templateUrl: 'views/submission/submissiondatatable.html',
                    controller: 'SubmissionController'
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
            resolve: {
                auth: function (AuthService, $q, $rootScope) {
                    var deferred = $q.defer();
                    /*check if user role is chair*/
                    if (!AuthService.checkUserRole()) {
                        deferred.reject({redirectTo: 'home'});
                    } else {
                        deferred.resolve({});
                    }
                    return deferred.promise;
                }
            }
        })
        .state('home.newsubmission', {
            url: 'submission',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/submission-form.html',
                    controller: 'SubmissionFormController'
                }
            },
        })
        .state('home.submission', {
            url: 'submission/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/submission.html',
                    controller: 'SubmissionController'
                }
            },
         })
        .state('home.reviewersubmit', {
            url: 'review',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/reviewform.html',
                    controller: 'ReviewerController'
                }
            },
        })
        .state('login', {
            url:'/login',
            views: {
                'mainpanel': {
                    templateUrl: 'views/authentication/login.html'
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
        .state('register', {
            url:'/register',
            views: {
                'mainpanel': {
                    templateUrl: 'views/authentication/registration.html'
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
    if(AuthService.checkUserRole()){
        $rootScope.chair = true;
        $rootScope.normalUser = false;
    } else {
        $rootScope.normalUser = true;
        $rootScope.chair = false;
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

