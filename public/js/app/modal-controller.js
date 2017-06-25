angular.module('myApp').controller('modalInstanceCtrl', function ($scope, $modalInstance, data) {

    $scope.data = data;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});