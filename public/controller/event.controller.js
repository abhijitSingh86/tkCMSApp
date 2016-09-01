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
        else if(parameter == "subscribed"){
            url = "/users/Subevents/"+AuthService.getUserId();
        }
        else if(parameter == "interested"){
            url = "/users/Intevents/"+AuthService.getUserId();
        } else {
            $state.go('home');
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
        $http.get('/users/allusers')
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

    $scope.renderUsersInterestedInEvent = function(){
        // url to get users to be interested in a event(to be changed)
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
    $scope.addToSubscribedUsers = function() {
        if($scope.selected == 0){
            $mdToast.show($mdToast.simple().textContent("Please select atleast one user"));
        } else {
            /*send list to service which will add users to subscribed users and refresh the table*/
            // url to submit users to be subscribed to an event(to be changed)
            var url;
            $http.post(url, $scope.selected)
            // handle success
                .success(function (data) {
                    $scope.renderUsersInterestedInEvent();
                    $scope.renderUsersSubscribedInEvent();
                })
                // handle error
                .error(function (data) {
                });
        }
    };

    $scope.renderUsersSubscribedInEvent = function(){
        // url to get users subscribed to an event(to be changed)
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

    $scope.removeFromSubscribedUsers = function() {
        if($scope.selected == 0){
            $mdToast.show($mdToast.simple().textContent("Please select atleast one user"));
        } else {
            /*send list to service which will add users to subscribed users and refresh the table*/
            // url to submit users to be subscribed to an event(to be changed)
            var url;
            $http.post(url, $scope.selected)
            // handle success
                .success(function (data) {
                    $scope.renderUsersInterestedInEvent();
                    $scope.renderUsersSubscribedInEvent();
                })
                // handle error
                .error(function (data) {
                });
        }
    };
});