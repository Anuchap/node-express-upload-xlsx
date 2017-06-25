angular.module('myApp').controller('landingCtrl', function ($scope, $state, $stateParams, $http, $modal) {

    $scope.goToBrowse = function () {
        $http.get('api/checkstatus/' + $stateParams.uid).success(function (data) {
            if (data.status === 'submitted') {
                $state.go('thankyou', {
                    uid: $stateParams.uid
                });
            } else if (data.status === 'finished') {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'modalInstanceCtrl',
                    resolve: {
                        data: function () {
                            return {};
                        }
                    }
                });
            } else {
                $http.get('api/started/' + $stateParams.uid).success(function () {
                    $state.go('summary', {
                        uid: $stateParams.uid
                    });
                });
            }
        });
    };
});