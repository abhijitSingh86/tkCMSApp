/**
 * Created by manny on 23.08.2016.
 */
var app = angular.module('eventsModule', []);
app.controller('EventController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
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
    $scope.loadSubmissions = function(){
        $state.go('home.event.submissions')
    }
    $scope.goToEvent = function(event){
        var userId = $rootScope.globals.currentUser.id;
        var interestedUsers = event.interestedUsers;
        angular.forEach(interestedUsers, function(value, key) {
            $scope.eventAccess = false;
            if(value === userId){
                $scope.eventAccess = true;
            }
        });
        $state.go('home.event',{id:event._id})
    }
    $scope.addToInterestedUser(event)
});