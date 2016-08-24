/**
 * Created by manny on 23.08.2016.
 */
var app = angular.module('eventsModule', []);
app.controller('EventController', function ($scope, $http, $mdToast, $state) {
    $scope.event = {};
    $scope.loadEvent = function() {
        $http.get('/subEvent/' + $state.params.id)
        // handle success
            .success(function (data) {
                if (data.start_date != null) data.start_date = new Date(data.start_date);
                if (data.end_date != null) data.end_date = new Date(data.end_date);
                $scope.event = data;
            })
            // handle error
            .error(function (data) {
            });
    };
    $scope.submitForm = function(event) {
        // send a post request to the server
        $http.post('/subEvents',
            event)
            // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $state.go('home.event',{id: data._id});
            })
            // handle error
            .error(function (data) {

            });
    };
    $scope.updateForm = function(event) {
        // send a put request to the server
        $http.put('/subEvent/' + $state.params.id,
            event)
        // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Updated Successfully"));
            })
            // handle error
            .error(function (data) {

            });
    };
});