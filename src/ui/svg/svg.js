/**
 * @fileoverview
 * Directive to easily inline svg images.
 * NOTE: kind of a hack to get ng-include to work properly within a directive
 * without wrapping it with an extra DOM element.
 */

angular.module('coreos.ui')
.directive('coSvg', function($, $rootScope, $compile) {
  'use strict';

  return {
    template: '<div></div>',
    restrict: 'E',
    replace: true,
    scope: {
      src: '@',
      width: '@',
      height: '@'
    },
    link: function(scope, elem, attrs) {
      var containerEl, html, newScope;
      newScope = $rootScope.$new();
      html = '<div class="co-m-svg" '+
              'ng-class="classes" ng-style="style" ng-include="src"></div>';
      newScope.style = {};
      if (scope.width) {
        newScope.style.width = scope.width + 'px';
      }
      if (scope.height) {
        newScope.style.height = scope.height + 'px';
      }
      if (attrs.class) {
        newScope.classes = attrs.class;
      }
      scope.$watch('src', function(src) {
        if (src) {
          newScope.src = src;
          containerEl = $compile(html)(newScope);
          elem.replaceWith(containerEl);
        }
      });
    }
  };

});
