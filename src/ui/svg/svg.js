/**
 * @fileoverview
 * Directive to easily inline svg images.
 */

'use strict';

angular.module('coreos.ui')
.directive('coSvg', function() {

  return {
    templateUrl: '/coreos.ui/svg/svg.html',
    transclude: false,
    restrict: 'E',
    replace: true,
    scope: {
      src: '@',
      width: '@',
      height: '@'
    },
    link: function(scope, elem) {
      scope.style = {};
      if (scope.width) {
        scope.style.width = scope.width + 'px';
      }
      if (scope.height) {
        scope.style.height = scope.height + 'px';
      }
      elem.append();
    }
  };

});
