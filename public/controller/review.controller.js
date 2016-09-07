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
                $scope.review = review;
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
    $scope.updateReview = function(review) {
        // send a put request to the server
        $http.put('/review/'+review._id,
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
        var url = '/review/getReviewForDocument/'+$stateParams.documentId;
            $http.get(url)
            // handle success
                .success(function (data) {
                    $scope.reviews = data;
                })
                // handle error
                .error(function (data) {
                });
    }
    $scope.renderDataTableForMyReviews = function(){
        //Get all reviews for the logged in User
        var url = '/getAllReviewForUser/'+AuthService.getUserId();
        $http.get(url)
        // handle success
            .success(function (data) {
                $scope.reviews = data;
            })
            // handle error
            .error(function (data) {
            });
    }

    $scope.goToReview = function(review){
        $state.go('home.review',{id:review._id});
    }
    $scope.loadReview = function(){
        $http.get("/review/"+$state.params.id)
        // handle success
            .success(function (data) {
                $scope.review = data[0];
                if(AuthService.getUserId() == $scope.review.createdBy._id){
                    $scope.allowUpdate = true;
                } else {
                    $scope.allowUpdate = false;
                }
            })
            // handle error
            .error(function (data) {
            });
    }
    $scope.renderAllReviewsDataTableForChair = function(){
        //Get all reviews
        var url = '/reviewer/';
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

app.controller('UserListForReviewController', function ($q, $http, $scope, DTOptionsBuilder, DTColumnDefBuilder, AuthService, $mdToast, $state) {
        var vm = this;
        vm.dtInstance = {};
        vm.dtInstance1 = {};
        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
        ];

        function getNotAcceptedUsers() {
            // url to get users to be assigned as a reviewer(to be changed)
            return $http.get('/subEvent/getInterestedReviewersBasedOnDocument/'+$state.params.id);
        }
        $scope.renderUsersToBeAssignedForReview = function(){
            var promise = getNotAcceptedUsers();
            promise.then(
            function(payload) {
                $scope.users = payload.data.notAccepted;
            },
            function(errorPayload) {
            });
        };

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
                        reload();
                    })
                    // handle error
                    .error(function (data) {
                    });
            }
        };

        function getAcceptedUsers() {
            // url to get users to be assigned as a reviewer(to be changed)
            return $http.get('/subEvent/getInterestedReviewersBasedOnDocument/'+$state.params.id);
        }
        $scope.renderUsersAssignedForReview = function(){
            var promise = getAcceptedUsers();
            promise.then(
                function(payload) {
                    $scope.usersAssigned = payload.data.accepted;
                },
                function(errorPayload) {
                });
        }
        $scope.remove = function() {
            if($scope.selected == 0){
                $mdToast.show($mdToast.simple().textContent("Please select atleast one user"));
            } else {
                /*send list to service which will assign this list of users as reviewers and refresh the table*/
                // url to submit users to be assigned as a reviewer(to be changed)
                var url = "removeDocumentToUsersReview";
                var data = {
                    "submissionDocumentId":$state.params.id,
                    "users":$scope.selected
                }
                $http.put(url, data)
                // handle success
                    .success(function (data) {
                        reload()
                    })
                    // handle error
                    .error(function (data) {
                    });
            }
        };

        function reload() {
            var promise = getNotAcceptedUsers();
            promise.then(
                function(payload) {
                    vm.dtInstance.changeData(payload.data.notAccepted);
                },
                function(errorPayload) {
                });

            var promise1 = getAcceptedUsers();
            promise1.then(
                function(payload) {
                    vm.dtInstance1.changeData(payload.data.accepted);
                },
                function(errorPayload) {
                });
        }
})