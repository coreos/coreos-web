/**
 * @fileoverview
 * Display a cog icon and construct dropdown menu.
 */


angular.module('coreos.ui')
.directive('coCog', function($location) {
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
      $scope.status = {
        isopen: false,
      };

      // Capture all clicks on the cog to prevent bubbling.
      $scope.captureClick = function($event) {
        $event.stopPropagation();
      };

      // Handles dropdown item clicks.
      $scope.clickHandler = function($event, option) {
        $event.preventDefault();
        $event.stopPropagation();
        if (option.callback) {
          option.callback();
        } else if (option.href) {
          $location.url(option.href);
        }
        $scope.status.isopen = false;
      };
    }
  };

});
