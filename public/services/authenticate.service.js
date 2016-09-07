angular.module('authenticationServiceModule',[]).factory('AuthService',
        function ($q, $timeout, $http, $rootScope, $state, $cookies,$cookieStore) {
            // create user variable
            var user = null;

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                register: register,
                checkUserRole: checkUserRole,
                getUserId : getUserId,
                getUser: getUser
            });
            function isLoggedIn() {
                var globals= $cookieStore.get('globals');
                //Check if user is already logged in, redirect to home page
                if (typeof(globals) != "undefined")
                {
                    return true;
                } else{
                    return false;
                }
            }
            function getUserId() {
                var globals= $cookieStore.get('globals');
                //Check if user is already logged in, redirect to home page
                if (typeof(globals) != "undefined")
                {
                    return globals.currentUser.id;
                }
            }
            function getUser() {
                var globals= $cookieStore.get('globals');
                //Check if user is already logged in, redirect to home page
                if (typeof(globals) != "undefined")
                {
                    return globals.currentUser;
                }
            }
            function checkUserRole() {
                var globals= $cookieStore.get('globals');
                if (typeof(globals) != "undefined") {
                    if (globals.currentUser.role == "chair")
                    {
                        return true;
                    } else{
                        return false;
                    }
                }
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/signin',
                    {username: username, password: password})
                // handle success
                    .success(function (data, status) {
                        if(status === 200){
                            $rootScope.globals = {
                                currentUser : {
                                    id : data.user.id,
                                    username : data.user.username,
                                    role: data.user.roles[0]
                                }
                            }
                            $cookieStore.put('globals', $rootScope.globals);
                            deferred.resolve();
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/signout')
                // handle success
                    .success(function (data) {
                        $rootScope.globals = {};
                        $cookieStore.remove('globals');
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });
                // return promise object
                return deferred.promise;

            }

            function register(details) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/signup',
                    details)
                // handle success
                    .success(function (data, status) {
                        if(status === 200){
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }
        });