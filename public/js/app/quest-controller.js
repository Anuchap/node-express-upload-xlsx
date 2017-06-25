angular.module('myApp').controller('questCtrl', function ($scope, $http, $state, $stateParams, store) {
    $scope.uid_ = $stateParams.uid;

    $scope.ans2 = [null,null,null,null,null,null,null,null,null,null,null];
    $scope.ans4_2 = [null,null,null,null,null,null,null,null,null];
    $scope.ans5 = [null,null,null,null,null,null,null,null,null,null,null,null,null];
    $scope.ans6 = [null,null,null,null,null,null,null];
    $scope.ans8 = [1,1,1,1,1,1,1,1];

    function sendAnswer(qno, answer, optional, callback) {
         $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: qno,
            answer: answer + '',
            optional: optional + ''
        }).success(callback);
    }

    // Quests 1 - 10
    function restore() {
        $scope.ans1 = store.ans1;
        $scope.ans2 = store.ans2 || $scope.ans2;
        $scope.ans2other = store.ans2other;
        $scope.ans3 = store.ans3;
        $scope.ans4_1 = store.ans4_1;
        $scope.ans4_2 = store.ans4_2 || $scope.ans4_2;
        $scope.ans5 = store.ans5 || $scope.ans5;
        $scope.ans6 = store.ans6 || $scope.ans6;  
        $scope.ans7 = store.ans7;
        $scope.ans8 = store.ans8 || $scope.ans8;
        $scope.ans9 = store.ans9;
        $scope.ans9other = store.ans9other;
    }
    
    restore();

    // Quest #1
    $scope.goToQuest2 = function () {
        if (!$scope.ans1) {
            alert('กรุณาเลือกอย่างน้อย 1 ข้อ.');
            return;
        }
        sendAnswer('1', $scope.ans1, null, function () {
            store.ans1 = $scope.ans1;
            $state.go('quest2', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #2  
    $scope.goToQuest3 = function () {
        var total = 0;
        var tmp = [];
        for (var i = 1; i < $scope.ans2.length; i++) {
            if($scope.ans2[i]) {
                total += parseInt($scope.ans2[i]);
                tmp.push({ key: i, value: $scope.ans2[i] });
            }            
        }
        if (total !== 100) {
            alert('กรุณาใส่ให้ผลรวมทั้งหมดเป็น 100%.');
            return;
        }
        var ans = _.pluck(tmp, 'key');
        var opt = _.pluck(tmp, 'value');
        sendAnswer('2', ans + '@' + $scope.ans2other, opt, function () {
            store.ans2 = $scope.ans2;
            store.ans2other = $scope.ans2other;
            $state.go('quest3', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #3
    $scope.goToQuest4 = function () {
        if (!$scope.ans3) {
            alert('กรุณาเลือกอย่างน้อย 1 ข้อ.');
            return;
        }
        sendAnswer('3', $scope.ans3, null, function () {
            store.ans3 = $scope.ans3;
            $state.go('quest4', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #4
    $scope.goToQuest5 = function () {
        var total = 0;
        var tmp = [];
        for (var i = 1; i < $scope.ans4_2.length; i++) {
            if($scope.ans4_2[i]) {
                total += parseInt($scope.ans4_2[i]);
                tmp.push({ key: i, value: $scope.ans4_2[i] });
            }            
        }
        if (total !== parseInt($scope.ans4_1)) {
            alert('กรุณาใส่ให้ผลรวมทั้งหมดให้เท่ากับข้อ 4.1.');
            return;
        }
        var ans = _.pluck(tmp, 'key');
        var opt = _.pluck(tmp, 'value');
        sendAnswer('4.1', parseInt($scope.ans4_1), null, function () {
            store.ans4_1 = parseInt($scope.ans4_1);
            sendAnswer('4.2', ans, opt, function () {
                store.ans4_2 = $scope.ans4_2;
                $state.go('quest5', {
                    uid: $stateParams.uid
                });
            });
        });

    };

    // Quest #5
    $scope.goToQuest6 = function () {
        var total = 0;
        var tmp = [];
        for (var i = 1; i < $scope.ans5.length; i++) {
            if($scope.ans5[i]) {
                total += parseInt($scope.ans5[i]);
                tmp.push({ key: i, value: $scope.ans5[i] });
            }            
        }
        if (total > store.ans4_1) {
            alert('กรุณาใส่ให้ผลรวมทั้งหมดไม่เกินในข้อ 4.1.');
            return;
        }
        var ans = _.pluck(tmp, 'key');
        var opt = _.pluck(tmp, 'value');
        sendAnswer('5', ans, opt, function () {
            store.ans5 = $scope.ans5;
            $state.go('quest6', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #6
    $scope.goToQuest7 = function () {
        var total = 0;
        var tmp = [];
        for (var i = 1; i < $scope.ans6.length; i++) {
            if($scope.ans6[i]) {
                total += parseInt($scope.ans6[i]);
                tmp.push({ key: i, value: $scope.ans6[i] });
            }            
        }
        /*if (total !== store.ans4_1) {
            alert('กรุณาใส่ให้ผลรวมทั้งหมดให้เท่ากับข้อ 4.1.');
            return;
        }*/
        var ans = _.pluck(tmp, 'key');
        var opt = _.pluck(tmp, 'value');
        sendAnswer('6', ans, opt, function () {
            store.ans6 = $scope.ans6;
            $state.go('quest7', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #7
    $scope.goToQuest8 = function () {
        if ($scope.ans7.length !== 3) {
            alert('กรุณาเลือก 3 ข้อ.');
            return;
        }
        sendAnswer('7', $scope.ans7, null, function () {
            store.ans7 = $scope.ans7;
            $state.go('quest8', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #8
    $scope.goToQuest9 = function () {  
        sendAnswer('8', $scope.ans8, null, function () {
            store.ans8 = $scope.ans8;
            $state.go('quest9', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #9
    $scope.goToQuest10 = function () {
        if (!$scope.ans9) {
            alert('กรุณาเลือกอย่างน้อย 1 ข้อ.');
            return;
        }
        sendAnswer('9', $scope.ans9, $scope.ans9other, function () {
            store.ans9 = $scope.ans9;
            store.ans9other = $scope.ans9other;
            $state.go('quest10', {
                uid: $stateParams.uid
            });
        });
    };

    // Quest #10
    $scope.goToThankYou2 = function () {
        if (!$scope.ans10_1 || !$scope.ans10_2) {
            alert('กรุณาเลือกอย่างน้อย 1 ข้อ.');
            return;
        }
        sendAnswer('10.1', $scope.ans10_1, null, function () {
            store.ans10_1 = $scope.ans10_1;
            sendAnswer('10.2', $scope.ans10_2, null, function () {
                store.ans10_2 = $scope.ans10_2;

                $http.get('finished.php?uid=' + $stateParams.uid).success(function () {
                    $state.go('thankyou2', {
                        uid: $stateParams.uid
                    });
                });
            });
        });
    };

});