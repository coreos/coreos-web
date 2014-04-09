/**
 * @fileoverview
 * Display a cog icon and construct dropdown menu.
 */

'use strict';

angular.module('coreos.ui')
.directive('coCog', function() {

  return {
    templateUrl: '/coreos.ui/cog/cog.html',
    restrict: 'E',
    replace: true,
    scope: {
      'apps': '=',
      'options': '=',
      'size': '@',
      'anchor': '@'
    },
    controller: function($scope) {
      $scope.clickHandler = function($event, option) {
        $event.preventDefault();
        $event.stopPropagation();
        if (option.callback) {
          option.callback();
        }
      };
    }
  };

});
