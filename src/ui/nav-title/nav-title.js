/**
 * @fileoverview
 * Display page title with primary action link.
 */


'use strict';
angular.module('coreos.ui')

.directive('coNavTitle', function() {
  return {
    templateUrl: '/coreos.ui/nav-title/nav-title.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      title: '@'
    }
  };
});
