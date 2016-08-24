/**
 * Created by pratik_k on 8/23/2016.
 */
angular.module('leftPanelModule',[]).controller('LeftPanelController',
    function ($scope, $http, $state) {
        $scope.expandCallback = function (index, id) {
            if (id === "events") {
                $http.get('/subEvents')
                // handle success
                    .success(function (data, status) {
                        $scope.events = data;
                    })
                    // handle error
                    .error(function (data) {

                    });
            }
        }
        $scope.openEvent = function (event) {
            $scope.activeItem = event;
            $state.go('home.event',{id: event._id});
        }
    });
