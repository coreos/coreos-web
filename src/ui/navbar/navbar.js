/**
 * @fileoverview
 * Top navbar which inlcudes nav links.
 */

angular.module('coreos.ui')

.directive('coNavbar', function(configSvc) {
  'use strict';

  return {
    templateUrl: '/coreos.ui/navbar/navbar.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      logoSrc: '@',
    },
    controller: function($scope) {
      $scope.config = configSvc.get();
      $scope.isCollapsed = true;
    }
  };

})


/**
 * Simple directive to create bootstrap friendly navbar links.
 * Will automatically add the 'active' class based on the route.
 */
.directive('coNavbarLink', function($location) {
  'use strict';

  return {
    templateUrl: '/coreos.ui/navbar/navbar-link.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      // The path to link to.
      'href': '@'
    },
    link: function(scope) {
      scope.isActive = function() {
        return $location.path() === scope.href;
      };
    }
  };

})

/**
 * Optional dropdown menu to put in the right of the navbar.
 */
.directive('coNavbarDropdown', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/navbar/navbar-dropdown.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      text: '@',
      pullRight: '=',
      pullRightClass: '@'
    },
    controller: function($scope) {
      if ($scope.pullRight) {
        $scope.pullRightClass = 'pull-right';
      }
    },
  };

});
