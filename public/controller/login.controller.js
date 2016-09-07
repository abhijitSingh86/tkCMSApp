/**
 * Created by pratik_k on 8/24/2016.
 */
angular.module('loginModule',[]).controller('LoginController',
        function ($scope, $location, AuthService,$rootScope, $state, $mdToast, $http) {
            var user = AuthService.getUser();
            if(user !== undefined) {
                $rootScope.userName = user.username;
            }
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

            $scope.editProfile = function(user){
                // send a put request to the server
                $http.put('/users/'+user._id,
                    user)
                    // handle success
                    .success(function (data) {
                        $mdToast.show($mdToast.simple().textContent("Updated Successfully"));
                        $scope.user = data;
                    })
                    // handle error
                    .error(function (data) {
                        $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
                    });
            }

            $scope.loadUserProfile = function(){
                $http.get('/users/'+AuthService.getUserId())
                    // handle success
                    .success(function (data) {
                        $scope.user = data;
                    })
                    // handle error
                    .error(function (data) {
                        $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
                    });
            }
        });