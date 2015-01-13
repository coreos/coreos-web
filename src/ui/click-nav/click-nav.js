/**
 * Simple directive to navigate to a route when the
 * element is clicked on.
 */

angular.module('coreos.ui')
.directive('coClickNav', function($location) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      function onClickHandler(event) {
        $location.url(attrs.coClickNav);
        scope.$apply();
        event.preventDefault();
        event.stopPropagation();
      }
      elem.on('click', onClickHandler);
      elem.on('$destroy', function() {
        elem.off('click', onClickHandler);
      });
    }
  };

});
