/**
 * Created by pratik_k on 8/24/2016.
 */
var app = angular.module('eventsModule', []);
app.controller('EventController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, AuthService) {
    $scope.event = {};
    $scope.renderDataTable = function(){
        var url;
        var parameter = $state.params.filter;
        if(parameter == "all"){
            url = "/subEvents"
        }
        if(parameter == "subscribed"){
            url = "/subEvents"
        }
        if(parameter == "interested"){
            url = "/subEvents"
        }
        loadEvents(url);
    }
    function loadEvents(url){
        $http.get(url)
        // handle success
            .success(function (data, status) {
                $scope.events = data;

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

    $scope.goToEvent = function(event){
        $state.go('home.event',{id:event._id})
    }

    $scope.loadEventForNormalUser = function() {
        $http.get('/subEvent/' + $state.params.id)
        // handle success
            .success(function (data) {
                if (data.start_date != null) data.start_date = new Date(data.start_date);
                if (data.end_date != null) data.end_date = new Date(data.end_date);
                $scope.event = data;
                var userId = AuthService.getUserId();
                var interestedUsers = data.interestedUsers;
                angular.forEach(interestedUsers, function(value, key) {
                    $scope.eventAccess = false;
                    if(value.id == userId){
                        $scope.eventAccess = true;
                    }
                });
            })
            // handle error
            .error(function (data) {
            });

    };

    $scope.loadSubmissionForNormalUser = function(){
        $http.get('/users/')
        // handle success
            .success(function (data) {
                $scope.authors = data;
            })
            // handle error
            .error(function (data) {
            });
        $scope.new=true;
        /*check whether user has already created a submission for that event.
        If already created, check the deadline and disable fields accordingly
        If already created change type to update
        */

        //retrieve document ID and store it in a variable to retrieve reviews
    }

    $scope.loadAllReviewsForNormalUser = function(){
        $state.go('home.event.reviews',{documentId: 1234});
    }

    /*Methods used for chair role*/
    $scope.submitForm = function(event) {
        // send a post request to the server
        $http.post('/subEvents',
            event)
        // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $state.go('home.event',{id: data.success._id});
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
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
                $mdToast.show($mdToast.simple().textContent(data.error));
            });
    };

    $scope.loadSubmissionsForNormalUser = function(){
        $state.go('home.event.submissions')
    }

    $scope.renderDataTableForChair = function () {
        var url = "/subEvents";
        loadEvents(url);
    }

    $scope.loadSubmissionsForChair = function(){
        $state.go('home.chair-event.submissions')
    }

    $scope.goToEventDetailsForChair = function(event){
        $state.go('home.chair-event',{id:event._id})
    }

    $scope.addToInterestedUser = function(event){

    }

});