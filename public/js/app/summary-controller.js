angular.module('myApp').controller('summaryCtrl', function ($scope, $state, $http, $modal, $stateParams, $timeout) {
    $scope.uploaded = false;

    $scope.setFile = function (element) {
        $scope.$apply(function () {
            $scope.currentFile = element.files[0];
        });
    };

    $scope.uploadFile = function () {
        loader.show('Data Verifying...');
        var formData = new FormData();
        formData.append("file", $scope.currentFile);
        //formData.append("uid", $stateParams.uid);
        $http.post("api/upload/" + $stateParams.uid, formData, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.uploaded = true;
            loader.hide();

            // transformation
            var data = [];
            for(var i = 0; i< 56;i++) { 
                if(res[0][i].total > 0 || res[1][i].total > 0) 
                   data.push({ y15: res[0][i], y16: res[1][i] }); 
            }
                        
            $scope.data = data;
            $scope.total15 = 0;
            _.each(data, function (item) {
                $scope.total15 += item.y15.total
            });
            $scope.total16 = 0;
            _.each(data, function (item) {
                $scope.total16 += item.y16.total
            });

            $timeout(function () {
                $scope.submitBtn = $('td > span.glyphicon-exclamation-sign').length > 0;
                $scope.submitMessage = $scope.submitBtn ? 'Cannot submit. Incorrect data found!' : '';
            });
        });
    };

    $scope.verify = function (disciplines) {
        return !_.find(disciplines, function (item) {
            return !item.isvalid;
        });
    };

    $scope.showDetail = function (name, data) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'modalInstanceCtrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return {
                        name: name,
                        data: data
                    };
                }
            }
        });
    };

    $scope.backToBrowse = function () {
        loader.show();
        $http.get('api/setstatus/' + $stateParams.uid + '/back').success(function () {
            loader.hide();
            $scope.uploaded = false;
        });
    };

    $scope.goToThankYou = function () {  
        var data = [];
        angular.copy($scope.data, data);
        var a = [];
        var b = [];

        _.each(data, function(item) {
            a.push(item.y15);
            b.push(item.y16);
        });

        loader.show();
        $http.post('api/submit/' + $stateParams.uid, [a, b]).success(function () {
            loader.hide();
            $state.go('thankyou', {
                uid: $stateParams.uid
            });
        });
    };
});