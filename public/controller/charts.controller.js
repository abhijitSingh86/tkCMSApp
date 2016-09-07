var app = angular.module('chartModule', []);
app.controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Accepted Submissions', 'Open Submissions'];
    $scope.data = [
        [64, 58, 81, 82, 57, 56, 41],
        [27, 49, 41, 18, 85, 28, 91]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    // Simulate async data update
    $timeout(function () {
        $scope.data = [
            [29, 49, 41, 18, 87, 28, 91],
            [66, 58, 81, 82, 55, 54, 41]
        ];
    }, 3000);

    $scope.labels1 = ["InProgress Submissions", "Completed Submissions"];
    $scope.data1 = [2, 5];
}]);