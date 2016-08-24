angular.module('loginModule',[]).controller('LoginController',
        function ($scope, $location, AuthService,$rootScope, $state) {

            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.user.username, $scope.user.password)
                // handle success
                    .then(function (data) {
                        $rootScope.currentUser = true;
                        $state.go('home');
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });

            };

            $scope.logout = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.logout()
                // handle success
                    .then(function (data) {
                        $rootScope.currentUser = false;
                        $state.go('login');
                    })
                    // handle error
                    .catch(function () {
                    });

            };
        });