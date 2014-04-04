/**
 * Broadcast when the window size breakpoints change.
 * TODO(sym3tri): change implementation to use window.matchMedia instead.
 */

'use strict';

angular.module('coreos.services')
.factory('breakpointSvc', function(_, $window, $rootScope, CORE_CONST,
      CORE_EVENT) {

  var previousName;

  function getSize() {
    var width = $window.innerWidth;
    return _.find(CORE_CONST.BREAKPOINTS, function(bp) {
      if (bp.min <= width && bp.max > width) {
        return true;
      }
    }).name;
  }

  function onResize() {
    var breakpointName = getSize();
    if (breakpointName !== previousName) {
      $rootScope.$broadcast(CORE_EVENT.BREAKPOINT, breakpointName);
      previousName = breakpointName;
    }
  }

  // Broadcast initial size.
  $rootScope.$broadcast(CORE_EVENT.BREAKPOINT, getSize());

  // Watch for resizes.
  angular.element($window).on('resize', _.debounce(onResize, 20, true));

  return {
    getSize: getSize
  };

});
