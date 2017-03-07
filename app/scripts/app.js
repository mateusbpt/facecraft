(function () {
    'use strict';
    angular
        .module('facecraft', ['ui.router', 'ui.bootstrap'])
        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise("/app");
        }]);
})();