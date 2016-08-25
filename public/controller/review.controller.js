/**
 * Created by manny on 24.08.2016.
 */
var app = angular.module('reviewerModule', []);
app.controller('ReviewerController', function ($scope, $http, $mdToast, $state) {
    $scope.event = {};
    $scope.reviewer = {}
    $scope.submitForm = function(review) {
        // send a post request to the server
        $http.post('/reviewer',
            review)
        // handle success
            .success(function (review) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $state.go('home.event',{id: data._id});
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
});