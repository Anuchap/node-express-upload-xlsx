angular.module('myApp').controller('landingCtrl', function ($scope, $state, $stateParams, $http, $modal) {

    $scope.goToBrowse = function () {
        loader.show();
        $http.get('api/checkstatus/' + $stateParams.uid).success(function (data) {
            if (data.status === 'submitted') {
                loader.hide();
                $state.go('thankyou', {
                    uid: $stateParams.uid
                });
            } else if (data.status === 'finished') {
                loader.hide();
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
                $http.get('api/setstatus/' + $stateParams.uid + '/started').success(function () {
                    loader.hide();
                    $state.go('summary', {
                        uid: $stateParams.uid
                    });
                });
            }
        });
    };
});