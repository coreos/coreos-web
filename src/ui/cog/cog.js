/**
 * @fileoverview
 * Display a cog icon and construct dropdown menu.
 */


angular.module('coreos.ui')
.directive('coCog', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/cog/cog.html',
    restrict: 'E',
    replace: true,
    scope: {
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
