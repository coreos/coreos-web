'use strict';

angular.module('app')
.controller('ServicesCtrl', function($scope, $q, $timeout, highlighterSvc,
      breakpointSvc, scrollerSvc, pollerSvc, documentVisibilitySvc,
      cookieSvc, CORE_EVENT) {

  // highlighter
  $scope.highlightMe = function($event) {
    highlighterSvc.highlight($event.target);
  };

  // scroller
  $scope.scrollToMe = function($event) {
    scrollerSvc.scrollTo($event.target);
  };

  // breakpoint
  $scope.windowSize = '';
  $scope.$on(CORE_EVENT.BREAKPOINT, function(e, size) {
    $scope.$apply(function() {
      $scope.windowSize = size;
    });
  });

  // doc visibility
  $scope.visibilityHistory = [];
  $scope.$on(CORE_EVENT.DOC_VISIBILITY_CHANGE, function(e, isHidden) {
    $scope.$apply(function() {
      $scope.visibilityHistory.push(isHidden);
    });
  });

  // poller
  $scope.pollValue = '';
  $scope.startPoller = function() {
    pollerSvc.register('examplePoller', {
      fn: function() {
        var d = $q.defer();
        $timeout(function() {
          d.resolve(Date.now());
        }, 0);
        return d.promise;
      },
      then: function(result) {
        $scope.pollValue = result;
      },
      scope: $scope,
      interval: 2000
    });
  };

  $scope.stopPoller = function() {
    pollerSvc.kill('examplePoller');
  };

  // cookie
  $scope.cookieValue = cookieSvc.get('example-cookie');
  $scope.setCookie = function() {
    cookieSvc.create('example-cookie', $scope.cookieValue);
  };

  $scope.removeCookie = function() {
    cookieSvc.remove('example-cookie');
    $scope.cookieValue = '';
  };

});
