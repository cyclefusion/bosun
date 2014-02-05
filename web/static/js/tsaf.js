/// <reference path="angular.d.ts" />
/// <reference path="angular-route.d.ts" />
var tsafApp = angular.module('tsafApp', [
    'ngRoute',
    'tsafControllers'
]);

tsafApp.config([
    '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/items', {
            templateUrl: 'partials/items.html',
            controller: 'ItemsCtrl'
        }).when('/expr', {
            templateUrl: 'partials/expr.html',
            controller: 'ExprCtrl'
        }).otherwise({
            redirectTo: '/'
        });
    }]);

var tsafControllers = angular.module('tsafControllers', []);


tsafControllers.controller('DashboardCtrl', [
    '$scope', '$http', function ($scope, $http) {
        $http.get('/api/alerts').success(function (data) {
            $scope.schedule = data;
        });
        $scope.last = function (history) {
            return history[history.length - 1];
        };
    }]);

tsafControllers.controller('ItemsCtrl', [
    '$scope', '$http', function ($scope, $http) {
        $http.get('/api/metric').success(function (data) {
            $scope.metrics = data;
        }).error(function (error) {
            $scope.status = 'Unable to fetch metrics: ' + error;
        });
        $http.get('/api/tagv/host').success(function (data) {
            $scope.hosts = data;
        }).error(function (error) {
            $scope.status = 'Unable to fetch hosts: ' + error;
        });
    }]);

tsafControllers.controller('ExprCtrl', [
    '$scope', '$http', function ($scope, $http) {
        $scope.expr = 'avg(q("avg:os.cpu{host=*}", "5m"))';
        $scope.eval = function () {
            $scope.error = '';
            $scope.running = $scope.expr;
            $scope.result = {};
            $http.get('/api/expr?q=' + encodeURIComponent($scope.expr)).success(function (data) {
                $scope.result = data;
                $scope.running = '';
            }).error(function (error) {
                $scope.error = error;
                $scope.running = '';
            });
        };
        $scope.json = function (v) {
            return JSON.stringify(v, null, '  ');
        };
    }]);