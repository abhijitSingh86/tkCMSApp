/**
 * Created by manny on 24.08.2016.
 */
var app = angular.module('reviewerModule', []);
app.controller('ReviewController', function ($scope, $http, $mdToast, $state,$stateParams) {
    $scope.reviewer = {}
    $scope.submitForm = function(review) {
        review.submissionDocId = $state.params.id;
        // send a post request to the server
        $http.post('/reviewer',
            review)
        // handle success
            .success(function (review) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                //$state.go('home.review',{id: data._id});
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
    $scope.renderDataTable = function(){
        //Get all reviews for this particular document Id
        $stateParams.documentId;
    }
});