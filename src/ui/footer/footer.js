/**
 * @fileoverview
 * Standard CoreOS footer.
 *
 */

angular.module('coreos.ui')

.directive('coFooter', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/footer/footer.html',
    transclude: true,
    restrict: 'E',
    replace: true
  };
})

.directive('coFooterLink', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/footer/footer-link.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      href: '@',
      iconClass: '@'
    }
  };
})


/**
 * Convenience wrapper for doing sticky footers.
 */
.directive('coFooterWrapper', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/footer/footer-wrapper.html',
    transclude: true,
    restrict: 'E',
    replace: true
  };

});
