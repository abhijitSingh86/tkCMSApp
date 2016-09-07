var mainApplicationModuleName = 'conference-system';
var mainApplicationModule = angular.module(mainApplicationModuleName, ['leftPanelModule','submissionModule','reviewerModule','authenticationServiceModule','loginModule','eventsModule','datatables', 'chartModule',
        'ngMaterial','ngMessages','ngRoute','ui.router','ngCookies','vAccordion','angularTrix', 'ncy-angular-breadcrumb','ngResource', 'chart.js']);

mainApplicationModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


mainApplicationModule.config(['$stateProvider', '$urlRouterProvider','$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: 'home',
        template: 'bootstrap2'
    });

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            views: {
                'header': {
                    templateUrl: 'views/partials/header.html'
                },
                /*'leftpanel': {
                    templateUrl: 'views/partials/accordianPanel.html',
                    controller: 'LeftPanelController'
                },*/
                'mainpanel': {
                    templateUrl: 'views/partials/content.html'
                },
                'footer': {
                    templateUrl: 'views/partials/footer.html'
                }
            },
            ncyBreadcrumb: {
                label: 'Home'
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
            ncyBreadcrumb: {
                label: 'Event {{event._id}}',
                parent: 'home'
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
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
            ncyBreadcrumb: {
                skip:true
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
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
            ncyBreadcrumb: {
                label: 'Events',
                parent: 'home'
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
        })
        //access: normal user
        .state('home.my-submissions', {
            url: 'my-submission',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/mysubmission-datatable.html',
                    controller: 'SubmissionController'
                }
            },
            ncyBreadcrumb: {
                label: 'My Submissions',
                parent: 'home'
            },
            resolve: {
                auth: authenticateNormalUserRole
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
            ncyBreadcrumb: {
                skip:true
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
        })
        //access: normal user
        .state('home.my-submission', {
            url: 'my-submission/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/my-submission.html',
                    controller: 'SubmissionController'
                }
            },
            ncyBreadcrumb: {
                label: 'Submission {{sub._id}}',
                parent: 'home.my-submissions'
            },
            resolve: {
                auth: authenticateNormalUserRole
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
            },
            ncyBreadcrumb: {
                label: 'Assigned Submissions',
                parent: 'home'
            },
            resolve: {
                auth: authenticateNormalUserRole
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
            },
            ncyBreadcrumb: {
                label: 'Submission {{sub._id}}',
                parent: 'home.assigned-submissions'
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
        })
        //access: normal user
        .state('home.assigned-submission.review', {
            views: {
                'review-form@home.assigned-submission': {
                    templateUrl: 'views/reviews/reviewform.html',
                    controller: 'ReviewController'
                }
            },
            params : { documentId: null },
            ncyBreadcrumb: {
                skip:true
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
        })
        //access: normal user
        .state('home.my-reviews', {
            url: 'my-reviews',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/myreview-datatable.html',
                    controller: 'ReviewController'
                }
            },
            ncyBreadcrumb: {
                label: 'My Reviews',
                parent: 'home'
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
        })
        //access: normal user/Chair User
        .state('home.review', {
            url: 'review/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/myreviewform.html',
                    controller: 'ReviewController'
                }
            },
            ncyBreadcrumb: {
                label: 'Review {{review._id}}',
                parent: 'home'
            },
        })
        //access: chair
        .state('home.newevent', {
            url: 'newevent',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/eventform.html',
                    controller: 'EventController'
                }
            },
            ncyBreadcrumb: {
                label: 'New Event',
                parent: 'home'
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-events', {
            url: 'all-event',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/chair.eventdatatable.html',
                    controller: 'EventController'
                }
            },
            ncyBreadcrumb: {
                label: 'All Events',
                parent: 'home'
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-event', {
            url: 'admin/event/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/event/event-chair.html',
                    controller: 'EventController'
                }
            },
            ncyBreadcrumb: {
                label: 'Event {{event._id}}',
                parent: 'home.chair-events'
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-event.submissions', {
            views: {
                'datatable@home.chair-event': {
                    templateUrl: 'views/submission/chair.submission-datatable.html',
                    controller: 'SubmissionController'
                }
            },
            ncyBreadcrumb: {
                skip:true
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-allsubmissions', {
            url: 'admin/all-submissions',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/chair.all-submissions-datatable.html',
                    controller: 'SubmissionController'
                }
            },
            ncyBreadcrumb: {
                label: "All Submissions",
                parent: "home"
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-submission', {
            url: 'admin/submission/:id',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/chair.submission.html',
                    controller: 'SubmissionController'
                }
            },
            ncyBreadcrumb: {
                label: 'Submission {{sub._id}}',
                parent: 'home'
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-submission.reviews', {
            views: {
                'review-datatable@home.chair-submission': {
                    templateUrl: 'views/reviews/reviewdatatable.html',
                    controller: 'ReviewController',
                }
            },
            params : { documentId: null },
            ncyBreadcrumb: {
                skip:true
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        //access: chair
        .state('home.chair-allreviews', {
            url: 'admin/all-reviews',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/reviews/chair.all-reviewsdatatable.html',
                    controller: 'ReviewController'
                }
            },
            ncyBreadcrumb: {
                label: 'All Reviews',
                parent: 'home'
            },
            resolve: {
                auth: authenticateChairUserRole
            }
        })
        .state('home.uploadDoc', {
            url: 'uploadDoc',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/submission/uploadDoc.html',
                    controller: 'SubmissionFormController'
                }
            },
            resolve: {
                auth: authenticateNormalUserRole
            }
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
        .state('forgot_pass', {
            url:'/forgot_pass',
            views: {
                'mainpanel': {
                    templateUrl: 'views/authentication/forgot_pass.html',
                    controller : 'forgotPasswordController'
                }
            }
        })
        .state('home.my-profile', {
            url:'my-profile',
            views: {
                'mainpanel@': {
                    templateUrl: 'views/authentication/editprofile.html',
                    controller : 'LoginController'
                }
            },
            ncyBreadcrumb: {
                label: 'My Profile',
                parent: 'home'
            },
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
        function authenticateNormalUserRole(AuthService, $q, $rootScope) {
            var deferred = $q.defer();
            if (!AuthService.checkUserRole()) {
                deferred.resolve({});
            } else {
                deferred.reject({redirectTo: 'home'});
            }
            return deferred.promise;
        }
        function authenticateChairUserRole(AuthService, $q, $rootScope) {
            var deferred = $q.defer();
            if (AuthService.checkUserRole()) {
                deferred.resolve({});
            } else {
                deferred.reject({redirectTo: 'home'});
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
            $state.go('home')
        }
    })
});
angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});

$('#upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});
$('#upload-input').on('change', function(){
    console.log('on change happened for file');
});
