/**
 * @fileoverview
 * Display page title with primary action link.
 */

angular.module('coreos.ui')
.directive('coNavTitle', function() {
  'use strict';

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
