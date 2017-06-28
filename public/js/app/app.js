var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'rzModule', 'checklist-model']);

myApp.factory('store', function () {
    return {};
});

myApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

window.onbeforeunload = function () { return 'Changes you made may not be saved.'; };