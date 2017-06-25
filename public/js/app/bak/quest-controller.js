angular.module('myApp').controller('questCtrl', function ($scope, $http, $state, $stateParams, store) {
    // all quest
    $scope.uid_ = $stateParams.uid;

    $scope.ans1 = store.a1;
    $scope.ans11 = store.a11;
    $scope.ans13 = store.a13;

    //quest2
    /*    $scope.slider = {
            value: store.a2 | 0,
            options: {
                floor: -100,
                ceil: 100,
                step: 1,
                hideLimitLabels: true,
                translate: function (value) {
                    return value + '%';
                }
            }
        };*/

    $scope.ans2 = store.a2;
    $scope.ans27 = store.a27;
    $scope.ans3 = store.a3;

    $scope.submitBtn = true;

    // quest5
    $scope.slider2 = {
        value: store.a4 || 50,
        value2: 50,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            hideLimitLabels: true,
            onChange: function () {
                $scope.submitBtn = false;
                $scope.slider2.value2 = 100 - $scope.slider2.value;
            },
        }
    };

    $scope.$watch('ans1', function () {
        $scope.ans11 = '';
        $scope.ans13 = '';
    });

    $scope.goToQuest2 = function () {
        if (!$scope.ans1) {
            alert('Please, select one answer choice.');
            return;
        }
        var optional = '';
        switch ($scope.ans1) {
        case '1':
            if (!$scope.ans11) {
                alert('Please, indicate percentage.');
                return;
            }
            optional = $scope.ans11;
            break;
        case '3':
            if (!$scope.ans13) {
                alert('Please, indicate percentage.');
                return;
            }
            optional = $scope.ans13;
            break;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 1,
            answer: $scope.ans1,
            optional: optional || ''
        }).success(function () {
            store.a1 = $scope.ans1;
            store.a11 = $scope.ans11;
            store.a13 = $scope.ans13;
            $state.go('quest2', {
                uid: $stateParams.uid
            });
        });
    };

    /*    $scope.goToQuest3 = function () {
            $http.post('answer.php', {
                uid: $stateParams.uid,
                qno: 2,
                answer: $scope.slider.value,
                optional: null
            }).success(function () {
                store.a2 = $scope.slider.value;
                $state.go('quest3', {
                    uid: $stateParams.uid
                });
            });
        };*/

    $scope.goToQuest3 = function () {
        if ($scope.ans2 == undefined || $scope.ans2.length === 0) {
            alert('Please, select one or more answer choices.');
            return;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 2,
            answer: $scope.ans2 + '',
            optional: $scope.ans27 || ''
        }).success(function () {
            store.a2 = $scope.ans2;
            store.a27 = $scope.ans27;
            $state.go('quest3', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToQuest4 = function () {
        if ($scope.ans3 == undefined || $scope.ans3.length === 0) {
            alert('Please, select one or more answer choices.');
            return;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 3,
            answer: $scope.ans3 + '',
            optional: ''
        }).success(function () {
            store.a3 = $scope.ans3;
            $state.go('quest4', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToThankYou2 = function () {
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 4,
            answer: $scope.slider2.value + ',' + $scope.slider2.value2,
            optional: ''
        }).success(function () {
            $http.get('finished.php?uid=' + $stateParams.uid).success(function () {
                store.a5 = $scope.slider2.value;
                $state.go('thankyou2', {
                    uid: $stateParams.uid
                });
            });
        });
    };
});