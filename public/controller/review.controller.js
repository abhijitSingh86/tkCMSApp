/**
 * Created by manny on 24.08.2016.
 */
var app = angular.module('reviewerModule', []);
app.controller('ReviewController', function ($scope, $http, $mdToast, $state,$stateParams, AuthService) {
    $scope.reviewer = {}
    $scope.submitReview = function(review) {
        review.submissionDocId = $state.params.id;
        review.createdBy = AuthService.getUserId();
        // send a post request to the server
        $http.post('/reviewer',
            review)
        // handle success
            .success(function (review) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $scope.new = false;
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
    $scope.updateReview = function(review) {
        // send a put request to the server
        $http.put('/reviewer/'+review._id,
            review)
        // handle success
            .success(function (review) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
    $scope.renderDataTable = function(){
        //Get all reviews for this particular document Id
        var url = '/reviewer/getreviewer/'+$stateParams.documentId;
            $http.get(url)
            // handle success
                .success(function (data) {
                    $scope.reviews = data;
                })
                // handle error
                .error(function (data) {
                });
    }
});

app.controller('UserListForReviewController', function ($http, $scope, DTOptionsBuilder, DTColumnDefBuilder, AuthService, $mdToast, $state) {

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
        ];
        $scope.renderUsersToBeAssignedForReview = function(){
            // url to get users to be assigned as a reviewer(to be changed)
            $http.get('/allusers')
                // handle success
                .success(function (data) {
                    $scope.users = data;
                })
                // handle error
                .error(function (data) {
                });
        }
        
        $scope.selected = [];
        $scope.toggle = function (itemId, list) {
            var idx = list.indexOf(itemId);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(itemId);
            }
        };
        $scope.add = function() {
            if($scope.selected == 0){
                $mdToast.show($mdToast.simple().textContent("Please select atleast one user"));
            } else {
                /*send list to service which will assign this list of users as reviewers and refresh the table*/
                // url to submit users to be assigned as a reviewer(to be changed)
                var url = "assignDocumentToUsersReview";
                var data = {
                    "submissionDocumentId":$state.params.id,
                    "users":$scope.selected
                }
                $http.put(url, data)
                // handle success
                    .success(function (data) {
                        $scope.renderUsersToBeAssignedForUser();
                    })
                    // handle error
                    .error(function (data) {
                    });
            }
        };

        $scope.renderUsersAssignedForReview = function(){
            // url to get users assigned as a reviewer for a particular submission(to be changed)
            $http.get('/allusers')
            // handle success
                .success(function (data) {
                    $scope.users = data;
                })
                // handle error
                .error(function (data) {
                });
        }
})