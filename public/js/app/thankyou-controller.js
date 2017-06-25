angular.module('myApp').controller('thankyouCtrl', function ($scope, $stateParams) {
    $scope.uid_ = $stateParams.uid;
});