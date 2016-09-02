/**
 * Created by pratik_k on 8/24/2016.
 */
var app = angular.module('submissionModule', []);
app.controller('SubmissionController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $stateParams, AuthService) {
    $scope.renderDataTable = function(parameter){
        var url;
        if(parameter == "mySubmissions"){
            //url = '/users/Subdocs/'+AuthService.getUserId();
            url = '/user/review/'+AuthService.getUserId();
        }
        if(parameter == "assignedSubmissions"){
            url = '/user/review/'+AuthService.getUserId();
        }
        loadSubmissions(url) // change to url when server side complete
    }
    function loadSubmissions(url){
        debugger;
        $http.get(url)
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

    $scope.loadSubmission= function(type) {
        if(type == "assigned"){
            $scope.showWithdraw = false;
            $scope.showUpdate = false;
        } else {
            $scope.showWithdraw = true;
            $scope.showUpdate = true;
        }
        $http.get('/allusers')
        // handle success
            .success(function (data) {
                $scope.authors = data;
            })
            // handle error
            .error(function (data) {
            });
        $http.get('/subDocument/' + $state.params.id)
        // handle success
            .success(function (data) {
                $scope.sub = data;
                $scope.sub.id = data._id;
                angular.forEach(data.authors,function(obj){
                    $scope.sub.authors.splice(obj);
                    $scope.sub.authors.push(obj.id);
                })
            })
            // handle error
            .error(function (data) {
            });
    };

    $scope.loadAllReviewsForNormalUser = function(){
        $state.go('home.my-submission.reviews',{documentId: $state.params.id});
    }

    $scope.loadReview = function(){
        //$state.go('home.assigned-submission.review',{documentId: $state.params.id});
        var docId = {
            "submissionDocId": $state.params.id
        }
        $http.post('/reviewForDocument/'+AuthService.getUserId(), docId)
        // handle success
            .success(function (data) {
                if(data.status == "notsubmitted"){
                    $scope.new = true;
                } else {
                    $scope.new = false;
                    $scope.review = data;   
                }
                
            })
            // handle error
            .error(function (data) {
            });
    }
    /*Methods used for chair*/
    $scope.renderDataTableForChair = function(){
        loadSubmissions('/subDocument') // change to url when server side complete
    }

    $scope.goToSubmissionForChair = function(submission){
        $state.go("home.chair-submission",{id: submission._id});
    }

    $scope.loadAllReviewsForChair = function(){
        $state.go('home.chair-submission.reviews',{documentId: $state.params.id});
    }
    $scope.authorListOfSubmission = function(){
        //to be changed: add url to get all author details of the submission
        $http.get('/submission/authors/'+$state.params.id)
            // handle success
            .success(function (data, status) {
                $scope.users = data;
            })
            // handle error
            .error(function (data) {

            });
    }
})

app.controller('SubmissionFormController', function ($scope, $http, $mdToast, $state, AuthService) {
    function getUserListForAuthor(){
        //to be changed
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
        sub.createdBy = AuthService.getUserId();
        $http.post('/subDocument', sub)
            // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $scope.hideReviewsTab = true;
                $scope.new = false;
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent(data.error));
            });
    }
    $scope.updateSubmissionSubmit = function(sub) {
        sub.submissionEventId = {};
        // send a put request to the server
        $http.put('/subDocument/' + sub.id,
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