/**
 * @fileoverview
 *
 * Inline loading indicator widget.
 */

'use strict';
angular.module('coreos.ui')

.directive('coInlineLoader', function() {

  return {
    templateUrl: '/coreos.ui/inline-loader/inline-loader.html',
    restrict: 'E',
    replace: true
  };

});
