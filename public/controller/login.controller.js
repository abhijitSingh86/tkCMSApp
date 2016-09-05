/**
 * Created by pratik_k on 8/24/2016.
 */
angular.module('loginModule',[]).controller('LoginController',
        function ($scope, $location, AuthService,$rootScope, $state, $mdToast) {

            $scope.login = function () {

                // call login from service
                AuthService.login($scope.user.username, $scope.user.password)
                // handle success
                    .then(function (data) {
                        $rootScope.currentUser = true;
                        if(AuthService.checkUserRole()){
                            $rootScope.chair = true;
                            $rootScope.normalUser = false;
                        } else {
                            $rootScope.normalUser = true;
                            $rootScope.chair = false;
                        }
                        $state.go('home');
                    })
                    // handle error
                    .catch(function (data) {
                        $mdToast.show($mdToast.simple().textContent(data.error));
                    });

            };

            $scope.logout = function () {

                // call login from service
                AuthService.logout()
                // handle success
                    .then(function (data) {
                        $rootScope.currentUser = false;
                        $state.go('login');
                    })
                    // handle error
                    .catch(function (data) {
                        $mdToast.show($mdToast.simple().textContent(data.error));
                    });

            };
            $scope.register = function (user) {

                // call login from service
                AuthService.register(user)
                // handle success
                    .then(function (data) {
                        $state.go('login');
                    })
                    // handle error
                    .catch(function (data) {
                        debugger;
                        $mdToast.show($mdToast.simple().textContent(data.error));
                    });

            };

            $scope.backtologin = function () {
                $state.go('login');
            }

            $scope.successText = "Some content";
            $scope.showSuccess = true;

            $scope.switchBool = function(value) {
                $scope[value] = !$scope[value];

            };
        });