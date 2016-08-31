/**
 * Created by pratik_k on 8/24/2016.
 */
var app = angular.module('submissionModule', []);
app.controller('SubmissionController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $stateParams) {
    $scope.renderDataTable = function(){
        $http.get('/subDocument')
        // handle success
            .success(function (data, status) {
                $scope.subs = data;

                $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0),
                    DTColumnDefBuilder.newColumnDef(1),
                    DTColumnDefBuilder.newColumnDef(2),
                    DTColumnDefBuilder.newColumnDef(3),
                    DTColumnDefBuilder.newColumnDef(4),
                    DTColumnDefBuilder.newColumnDef(5).notSortable()
                ];
            })
            // handle error
            .error(function (data) {

            });
    }

    $scope.goToMySubmission = function(submission){
        $state.go("home.my-submission",{id: submission._id});
    }

    $scope.goToAssignedSubmission = function(submission){
        $state.go("home.assigned-submission",{id: submission._id});
    }

    $scope.loadSubmission= function() {
        $http.get('/subDocument/' + $state.params.id)
        // handle success
            .success(function (data) {
                $scope.sub = data;
            })
            // handle error
            .error(function (data) {
            });
    };

    $scope.loadAllReviewsForNormalUser = function(){
        $state.go('home.my-submission.reviews',{documentId: $state.params.id});
    }

    $scope.loadReview = function(){
        $state.go('home.assigned-submission.review',{documentId: $state.params.id});
    }
})

app.controller('SubmissionFormController', function ($scope, $http, $mdToast, $state) {
    function getUserListForAuthor(){
        $http.get('/users')
        // handle success
            .success(function (data, status) {
                $scope.users = data;
            })
            // handle error
            .error(function (data) {

            });
    }

    $scope.submissionSubmit = function(sub){
        sub.submissionEventId = $state.params.id;
        $http.post('/subDocument', sub)
            // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent(data.error));
            });
    }
    $scope.updateSubmissionSubmit = function(sub) {
        // send a put request to the server
        $http.put('/subDocument/' + $state.params.id,
            sub)
        // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Updated Successfully"));
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent(data.error));
            });
    };
})