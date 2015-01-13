/**
 * @fileoverview
 * Highlight an item when its bound data changes.
 */


angular.module('coreos.ui')
.directive('coHighlight', function(highlighterSvc) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {

      scope.$watch(attrs.coHighlight, function(newValue, oldValue) {
        if (newValue !== oldValue) {
          highlighterSvc.highlight(elem);
        }
      });

    }
  };

});
