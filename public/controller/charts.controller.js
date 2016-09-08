var app = angular.module('chartModule', []);
app.controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Accepted Submissions', 'Open Submissions'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    // Simulate async data update
    $timeout(function () {
        $scope.data = [
            [28, 48, 40, 19, 86, 27, 90],
            [65, 59, 80, 81, 56, 55, 40]
        ];
    }, 3000);

    $scope.labels1 = ["InProgress Submissions", "Completed Submissions"];
    $scope.data1 = [2, 5];
}]);
