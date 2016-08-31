var mainApplicationModuleName = 'conference-system';
var mainApplicationModule = angular.module(mainApplicationModuleName
    , ['leftPanelModule','submissionModule','reviewerModule','authenticationServiceModule','loginModule','eventsModule','datatables','ngMaterial','ngMessages','ngRoute','ui.router','ngCookies','vAccordion','angularTrix']);

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
        //access: normal user
        .state('home.event', {
            url: 'event/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/event-user.html',
                    controller: 'EventController'
                }
            },
        })
        //access: normal user
        .state('home.event.reviews', {
            views: {
                'review-datatable@home.event': {
                    templateUrl: 'views/reviews/reviewdatatable.html',
                    controller: 'ReviewController',
                }
            },
            params : { documentId: null },
        })
        //access: normal user
        .state('home.events', {
            url: 'events/:filter',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/eventdatatable.html',
                    controller: 'EventController'
                }
            },
        })
        //access: normal user
        .state('home.my-submissions', {
            url: 'my-submission',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/mysubmission-datatable.html',
                    controller: 'SubmissionController'
                }
            }
        })
        //access: normal user
        .state('home.my-submission.reviews', {
            views: {
                'review-datatable@home.my-submission': {
                    templateUrl: 'views/reviews/reviewdatatable.html',
                    controller: 'ReviewController',
                }
            },
            params : { documentId: null },
        })
        //access: normal user
        .state('home.my-submission', {
            url: 'my-submission/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/my-submission.html',
                    controller: 'SubmissionController'
                }
            }
        })
        //access: normal user
        .state('home.assigned-submissions', {
            url: 'assigned-submission',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/assigned-submission-datatable.html',
                    controller: 'SubmissionController'
                }
            }
        })
        //access: normal user
        .state('home.assigned-submission', {
            url: 'assigned-submission/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/assigned-submission.html',
                    controller: 'SubmissionController'
                }
            }
        })
        //access: normal user
        .state('home.assigned-submission.review', {
            views: {
                'review-form@home.assigned-submission': {
                    templateUrl: 'views/reviews/reviewform.html',
                    controller: 'ReviewController',
                }
            },
            params : { documentId: null },
        })
        //access: normal user
        .state('home.my-reviews', {
            url: 'my-reviews',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/reviewdatatable.html',
                    controller: 'SubmissionController'
                }
            }
        })
        //access: chair
        .state('chair.home.event.submissions', {
            url: '/submission',
            views: {
                'datatable@home.event': {
                    templateUrl: 'views/submission/mysubmission-datatable.html',
                    controller: 'SubmissionController'
                }
            },
        })
        .state('home.newevent', {
            url: 'newevent',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/eventform.html',
                    controller: 'EventController'
                }
            },
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
        .state('home.reviewersubmit', {
            url: 'review',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/reviewform.html',
                    controller: 'ReviewController'
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
                auth: authenticateLogin
            }
        })
        .state('register', {
            url:'/register',
            views: {
                'mainpanel': {
                    templateUrl: 'views/authentication/registration.html',
                    controller: 'LoginController'
                }
            },
            resolve: {
                auth: authenticateLogin
            }
        })
        function authenticateLogin(AuthService, $q, $rootScope) {
            var deferred = $q.defer();
            if (AuthService.isLoggedIn()) {
                deferred.reject({redirectTo: 'home'});
            } else {
                deferred.resolve({});
            }
            return deferred.promise;
        }
}]);
mainApplicationModule.run(function ($rootScope, AuthService, $state) {
    if(AuthService.checkUserRole()){
        $rootScope.chair = true;
        $rootScope.normalUser = false;
    } else {
        $rootScope.normalUser = true;
        $rootScope.chair = false;
    }
    if(AuthService.isLoggedIn()){
        $rootScope.currentUser = true;
    } else {
        $rootScope.currentUser = false;
    }
    $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
        evt.preventDefault();
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

