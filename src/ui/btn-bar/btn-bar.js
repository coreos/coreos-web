/**
 * @fileoverview
 * Wrap buttons and automatically enable/disbale and show loading indicator.
 */

angular.module('coreos.ui')
.directive('coBtnBar', function($, $timeout, $compile) {
  'use strict';

  return {
    templateUrl: '/coreos.ui/btn-bar/btn-bar.html',
    restrict: 'EA',
    transclude: true,
    replace: true,
    scope: {
      // A promise that indicates completion of async operation.
      'completePromise': '='
    },
    link: function(scope, elem) {
      var linkButton,
          loaderDirectiveEl;

      linkButton = $('.btn-link', elem).last();
      loaderDirectiveEl =
          angular.element('<co-inline-loader></co-inline-loader>');
      $compile(loaderDirectiveEl)(scope);

      function disableButtons() {
        elem.append(loaderDirectiveEl);
        $('button', elem).attr('disabled', 'disabled');
        linkButton.addClass('hidden');
      }

      function enableButtons() {
        loaderDirectiveEl.remove();
        $('button', elem).removeAttr('disabled');
        linkButton.removeClass('hidden');
      }

      scope.$watch('completePromise', function(completePromise) {
        if (completePromise) {
          // Force async execution so disabling the button won't prevent form
          // submission.
          $timeout(disableButtons, 0);
          completePromise.finally(function() {
            // Also enable buttons asynchronously in case the request completes
            // before disableButtons() runs.
            $timeout(enableButtons, 0);
          });
        }
      });
    }

  };

});
