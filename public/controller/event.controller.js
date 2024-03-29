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
            url = "/subEvents";
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
        else if(parameter == "subscribed"){
            url = "/subEvent/retrieveAcceptedAndNotAcceptedEventsForUser/"+AuthService.getUserId();
            $http.get(url)
            // handle success
                .success(function (data, status) {
                    $scope.events = data.acceptedEvent;

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
        else if(parameter == "interested"){
            url = "/subEvent/retrieveAcceptedAndNotAcceptedEventsForUser/"+AuthService.getUserId();
            $http.get(url)
            // handle success
                .success(function (data, status) {
                    $scope.events = data.notAcceptedEvent;

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
        } else {
            $state.go('home');
        }
    }
    function loadEvents(url){
        $http.get(url)
        // handle success
            .success(function (data, status) {
                debugger;
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
                $http.get('/subEvent/retrieveApprovedAuthorsToEvent/'+$state.params.id)
                // handle success
                    .success(function (data) {
                        $scope.users = [];
                        $scope.eventAccess = false;
                        $scope.waitingForApproval = false;
                        angular.forEach(data.acceptedUser, function(id){
                            if(id._id == userId){
                                $scope.eventAccess = true;
                            }
                        })
                        angular.forEach(data.notAcceptedUser, function(id){
                            if(id._id == userId){
                                $scope.eventAccess = false;
                                $scope.waitingForApproval = true;
                            }
                        })
                    })
                    // handle error
                    .error(function (data) {
                    });
                
                /*var interestedUsers = data.interestedUsers;
                angular.forEach(interestedUsers, function(value, key) {
                    if(value.id == userId){
                        $scope.eventAccess = true;
                    }
                });*/
            })
            // handle error
            .error(function (data) {
            });

        /*check whether user has already created a submission for this event.
         If already created change type to update
         */
        var dataToCheckDocumentForEvent = {
            "userId" : AuthService.getUserId(),
            "submissionEventId" : $state.params.id
        }
        $http.post('subDocumentByEventId',dataToCheckDocumentForEvent)
            .success(function (data) {
                if(data.status == "notsubmitted"){
                    $scope.new = true;
                    $scope.hideReviewsTab = false;
                } else {
                    $scope.hideReviewsTab = true;
                    $scope.new = false;
                    $scope.showUpdate = true;
                    $scope.showWithdraw = true;
                    $http.get('/subDocument/'+data._id)
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
                    $http.get('/review/getReviewForDocument/' + data._id)
                    // handle success
                        .success(function (data) {
                            $scope.reviews = data;
                        })
                        // handle error
                        .error(function (data) {
                        });
                }
            })
            // handle error
            .error(function (data) {
            });

        //retrieve document ID and store it in a variable to retrieve reviews
    };

    $scope.loadSubmissionForNormalUser = function(){
        $http.get('/allusers')
        // handle success
            .success(function (data) {
                $scope.authors = data;
            })
            // handle error
            .error(function (data) {
            });
    }

    $scope.loadAllReviewsForNormalUser = function(){
        $state.go('home.event.reviews',{documentId: documentIdForReviews});
    }

    $scope.addToInterestedUser = function(event){
        var sendData = {
            "interestedUsers":[AuthService.getUserId()]
        }
        var url = "/subEvent/addtointeresteduserlist/"+event._id;
        $http.put(url, sendData)
        // handle success
            .success(function (data) {
                //reload event page
                $scope.waitingForApproval = true;
                $state.go('home.event',{id:event._id})
            })
            // handle error
            .error(function (data) {
            });
    }

    $scope.loadSubmissionsForNormalUser = function(){
        $state.go('home.event.submissions')
    }
    /*Methods used for chair role*/
    $scope.submitForm = function(event) {
        // send a post request to the server
        event.createdBy = AuthService.getUserId();
        $http.post('/subEvents',
            event)
        // handle success
            .success(function (data) {
                $mdToast.show($mdToast.simple().textContent("Created Successfully"));
                $state.go('home.chair-event',{id: data.success._id});
            })
            // handle error
            .error(function (data) {
                $mdToast.show($mdToast.simple().textContent("Error Occurred \n"+data));
            });
    };
    $scope.updateForm = function(event) {
        // send a put request to the server
        delete event.createdBy;
        delete event.interestedUsers;
        delete event.interestedUsersAsReviewer;
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

});

app.controller('EventUsersNotAcceptedController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, AuthService) {
    var vm = this;
    vm.reloadData = reloadData;
    vm.dtInstance1 = {};
    function reloadData() {
        var promise = getNotAcceptedAuthors();
        promise.then(
            function(payload) {
                vm.users = payload.data.notAcceptedUser;
            },
            function(errorPayload) {
            });
    }
    $rootScope.$on("reloadNotApprovedAuthorsTable", function(event){
        reloadData();
    });
    function getNotAcceptedAuthors()  {
        return $http.get('/subEvent/retrieveApprovedAuthorsToEvent/'+$state.params.id);
    }

    vm.dtOptions1 = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    vm.dtColumnDefs1 = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
    ];

    $scope.renderUsersInterestedInEvent = function(){
        var promise = getNotAcceptedAuthors();
        promise.then(
            function(payload) {
                vm.users = payload.data.notAcceptedUser;
            },
            function(errorPayload) {
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
            var url = "/assignEventToUsers/";
            var usersList = {
                "submissionEventId" : $state.params.id,
                "users" : $scope.selected
            }

            $http.put(url, usersList)
            // handle success
                .success(function (data) {
                    reloadData();
                    $rootScope.$emit("reloadApprovedAuthorsTable");
                })
                // handle error
                .error(function (data) {
                });
        }
    };
});

app.controller('EventUsersAcceptedController', function ($scope, $http, $mdToast, $state, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, AuthService, $resource) {
    var vm = this;
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData() {
        var promise = getApprovedAuthors();
        promise.then(
            function(payload) {
                vm.usersApproved = payload.data.acceptedUser;
            },
            function(errorPayload) {
            });
    }
    $rootScope.$on("reloadApprovedAuthorsTable", function(event,arg){
        reloadData();
    });
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
    ];

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
    
    $scope.renderUsersSubscribedInEvent = function(){
        var promise = getApprovedAuthors();
        promise.then(
            function(payload) {
                vm.usersApproved = payload.data.acceptedUser;
            },
            function(errorPayload) {
            });
    }

    $scope.removeFromSubscribedUsers = function() {
        if($scope.selected == 0){
            $mdToast.show($mdToast.simple().textContent("Please select atleast one user"));
        } else {
            /*send list to service which will add users to subscribed users and refresh the table*/
            var url = "/subEvent/addtointeresteduserlist/"+$state.params.id;
            var usersList = {'interestedUsers':$scope.selected};
            $http.post(url, usersList)
            // handle success
                .success(function (data) {
                    reloadData();
                    $rootScope.$emit("reloadNotApprovedAuthorsTable");
                })
                // handle error
                .error(function (data) {
                });
        }
    };

    function getApprovedAuthors()  {
        return $http.get('/subEvent/retrieveApprovedAuthorsToEvent/'+$state.params.id);
    }
});