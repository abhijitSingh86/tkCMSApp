/**
 * Created by sufyjakate on 28/05/16.
 */
var app = angular.module('MyApp1',['ngMaterial', 'ngMessages']);
    app.factory('UserService', ['$resource',
            function($resource){
                return $resource('/myapp/rest/user/:id',
                {
                    id: "@id"
                },
                {
                    'resetPassword': {method: 'GET', params: {email: '@email'}, url: '/myapp/rest/user/reset-password/:email'}
                }
                );
            }]);
    app.controller('ResetPasswordCtrl', ['$scope', '$location', 'UserService',
    function ResetPasswordCtrl($scope, $location, UserService) {

        // action handler for ng-click on form
        $scope.resetPassword = function() {
            UserService.resetPassword({email: $scope.resetPasswordEmail}, $scope.successHandlerResetPassword, $scope.errorHandler);
        };

        $scope.errorHandler = function(error) {
            console.log(error);
            $location.path('/error');
        };

        $scope.successHandlerResetPassword = function(httpResponse) {
            console.log('SUCCESS!');
            $location.path('/home');
        };

    }]);