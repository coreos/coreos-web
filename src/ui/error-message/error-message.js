/**
 * @fileoverview
 * Displays a message based on a promise.
 */

'use strict';
angular.module('coreos.ui')


.provider('errorMessageSvc', function() {

  var formatters = {};

  this.registerFormatter = function(name, fn) {
    formatters[name] = fn;
  };

  this.$get = function() {
    return {
      getFormatter: function(name) {
        return formatters[name] || angular.noop;
      }
    };
  };

})


.directive('coErrorMessage', function(errorMessageSvc) {

  return {
    templateUrl: '/coreos.ui/error-message/error-message.html',
    restrict: 'E',
    replace: true,
    scope: {
      promise: '=',
      formatter: '@',
      customMessage: '@message'
    },
    controller: function postLink($scope) {
      $scope.show = false;

      function handler(resp) {
        if ($scope.formatter) {
          $scope.message =
            errorMessageSvc.getFormatter($scope.formatter)(resp);
        } else if ($scope.customMessage) {
          $scope.message = $scope.customMessage;
        } else {
          return;
        }
        $scope.show = true;
      }

      $scope.$watch('promise', function(promise) {
        $scope.show = false;
        if (promise && promise.catch) {
          promise.catch(handler);
        }
      });

    }
  };

});
