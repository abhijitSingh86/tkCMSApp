/**
 * Created by manny on 03.09.2016.
 */
angular.module('loginModule').controller('forgotPasswordController',
    function ($scope) {
        $scope.resetPasswordEmail= "hello@gmail.com";
        $scope.resetPassword = function(){
            console.log($scope.resetPasswordEmail);
        };

    });
