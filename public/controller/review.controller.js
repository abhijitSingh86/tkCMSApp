/**
 * Created by manny on 24.08.2016.
 */
var app = angular.module('reviewerModule', []);
app.controller('ReviewController', function ($scope, $http, $mdToast, $state,$stateParams) {
    $scope.reviewer = {}
    $scope.submitForm = function(review) {
        review.submissionDocId = $state.params.id;
        // send a post request to the server
        $http.put('/reviewer',
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

app.controller('UserListForReviewController', function ($http, $scope, DTOptionsBuilder, DTColumnDefBuilder, AuthService, $mdToast) {

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
        ];
        $scope.renderUsersToBeAssignedForReview = function(){
            // url to get users to be assigned as a reviewer
            $http.get('/users/'+AuthService.getUserId())
                // handle success
                .success(function (data) {
                    // to be changed when service is ready
                    var array = [];
                    array.push(data);
                    $scope.users = array;
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
                var url;
                $http.post(url, $scope.selected)
                // handle success
                    .success(function (data) {
                        $scope.renderUsersToBeAssignedForUser();
                    })
                    // handle error
                    .error(function (data) {
                    });
            }
        };
})