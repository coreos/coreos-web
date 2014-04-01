'use strict';

angular.module('app', []);

// The main etcd dashboard module.
var app = angular.module('app', [
  'coreos'
]);

// Routes
app.config(function($routeProvider, $locationProvider, $httpProvider,
    pollerSvcProvider, configSvcProvider, errorMessageSvcProvider) {

  // General configure for coreos-web library.
  configSvcProvider.config({
    siteBasePath: '/example',
    libPath: '/../src'
  });

  errorMessageSvcProvider.registerFormatter('foo', function(resp) {
    return resp.error;
  });

  // Configure poller service.
  pollerSvcProvider.settings({
    interval: 5000,
    maxRetries: 5
  });

  $locationProvider.html5Mode(true);
  //$httpProvider.interceptors.push('httpInterceptor');

  $routeProvider
    .when('/example/index.html', {
      redirectTo: '/example'
    })
    .when('/example', {
      controller: 'MainPageCtrl',
      templateUrl: '/example/main-page.html',
      title: 'CoreOS Web Examples'
    })
    .when('/example/page1', {
      controller: 'Page1Ctrl',
      templateUrl: '/example/page1.html',
      title: 'Page 1 Layout'
    })
    .when('/example/js-modules', {
      controller: 'JsModulesCtrl',
      templateUrl: '/example/js-modules.html',
      title: 'JS Modules'
    })
    .when('/example/css-modules', {
      controller: 'CssModulesCtrl',
      templateUrl: '/example/css-modules.html',
      title: 'CSS Modules'
    })
    .when('/example/services', {
      controller: 'ServicesCtrl',
      templateUrl: '/example/services.html',
      title: 'Services'
    })
    .when('/404', {
      templateUrl: '/404.html',
      title: 'Not Found'
    });
})
.run(function($rootScope, $location, CORE_EVENT) {

  $rootScope.$on(CORE_EVENT.NOT_FOUND, function() {
    $location.url('/404');
  });

});
