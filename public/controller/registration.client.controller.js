/*angular.module('registrationModule',[])
    .controller('RegistrationFormController', function($scope, $http, $mdToast, $location) {
        $scope.registrationSubmit = function (details) {
            $http({
                method : 'POST',
                url : '/users',
                data : details
            }).success(function(data) {
                if(data.user=="invalid"){
                    $mdToast.show($mdToast.simple().textContent(data.error));
                } else if(data.user=="valid") {
                    $mdToast.show($mdToast.simple().textContent('User Register Successful!!'));
                }
            });
        };
        $scope.backtologin = function(){
            $location.path("/home");
        };
    });*/

angular.module('registrationModule',[]).controller('RegistrationFormController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.register = function (user) {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register(user)
                // handle success
                    .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };
        }]);