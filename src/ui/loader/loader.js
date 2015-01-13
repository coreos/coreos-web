/**
 * @fileoverview
 *
 * Loading indicator that centers itself inside its parent.
 */

angular.module('coreos.ui')

.directive('coLoader', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/loader/loader.html',
    restrict: 'E',
    replace: true
  };
})

.directive('coInlineLoader', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/loader/inline-loader.html',
    restrict: 'E',
    replace: true
  };
});
