angular.module('myApp').config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing');

    $stateProvider
        .state('landing', {
            url: '/landing/:uid',
            templateUrl: 'partials/landing.html',
            controller: 'landingCtrl'
        })
        .state('browse', {
            url: '/browse/:uid',
            templateUrl: 'partials/browse.html',
            controller: 'browseCtrl'
        })
        .state('summary', {
            url: '/summary/:uid',
            templateUrl: 'partials/summary.html',
            controller: 'summaryCtrl'
        })
        .state('thankyou', {
            url: '/thankyou/:uid',
            templateUrl: 'partials/thankyou.html',
            controller: 'thankyouCtrl'
        })
        .state('quest1', {
            url: '/quest1/:uid',
            templateUrl: 'partials/quests/quest1.html',
            controller: 'questCtrl'
        })
        .state('quest2', {
            url: '/quest2/:uid',
            templateUrl: 'partials/quests/quest2.html',
            controller: 'questCtrl'
        })
        .state('quest3', {
            url: '/quest3/:uid',
            templateUrl: 'partials/quests/quest3.html',
            controller: 'questCtrl'
        })
        .state('quest4', {
            url: '/quest4/:uid',
            templateUrl: 'partials/quests/quest4.html',
            controller: 'questCtrl'
        })
        .state('quest5', {
            url: '/quest5/:uid',
            templateUrl: 'partials/quests/quest5.html',
            controller: 'questCtrl'
        })
        .state('quest6', {
            url: '/quest6/:uid',
            templateUrl: 'partials/quests/quest6.html',
            controller: 'questCtrl'
        })
        .state('quest7', {
            url: '/quest7/:uid',
            templateUrl: 'partials/quests/quest7.html',
            controller: 'questCtrl'
        })
        .state('quest8', {
            url: '/quest8/:uid',
            templateUrl: 'partials/quests/quest8.html',
            controller: 'questCtrl'
        })
        .state('quest9', {
            url: '/quest9/:uid',
            templateUrl: 'partials/quests/quest9.html',
            controller: 'questCtrl'
        })
        .state('quest10', {
            url: '/quest10/:uid',
            templateUrl: 'partials/quests/quest10.html',
            controller: 'questCtrl'
        })
        .state('confirm', {
            url: '/confirm/:uid',
            templateUrl: 'partials/quests/confirm.html',
            controller: 'questCtrl'
        })
        .state('thankyou2', {
            url: '/thankyou2/:uid',
            templateUrl: 'partials/thankyou2.html'
        })
        .state('table', {
            url: '/table',
            templateUrl: 'partials/table.html'
        });
});