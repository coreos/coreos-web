/**
 * @fileoverview
 *
 * Loading indicator that centers itself inside its parent.
 */


'use strict';
angular.module('coreos.ui')

.directive('coLoader', function() {
  return {
    templateUrl: '/coreos.ui/loader/loader.html',
    restrict: 'E',
    replace: true
  };
});
