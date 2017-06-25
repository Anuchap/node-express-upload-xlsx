angular.module('myApp').controller('browseCtrl', function ($scope, $state, $http, $stateParams) {

    $scope.setFile = function (element) {
        $scope.$apply(function () {
            $scope.currentFile = element.files[0];
        });
    };

    $scope.uploadFile = function () {
        loader.show();
        var formData = new FormData();
        formData.append("file", $scope.currentFile);
        //formData.append("uid", $stateParams.uid);
        $http.post("api/upload/" + $stateParams.uid, formData, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (res) {
            loader.hide();
            if (res.indexOf('Sorry') === -1) {
                $state.go('summary', {
                    uid: $stateParams.uid
                });
            } else {
                $scope.errorMessage = res;
            }
        });
    };
});