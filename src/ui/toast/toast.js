/**
 * @fileoverview
 * Directive to display global error or info messages.
 * Enqueue messages through the toastSvc.
 */



angular.module('coreos.ui')
.directive('coToast', function() {
  'use strict';

  return {
    templateUrl: '/coreos.ui/toast/toast.html',
    restrict: 'E',
    replace: true,
    scope: true,
    controller: function($scope, toastSvc) {
      $scope.messages = toastSvc.messages;
      $scope.dismiss = toastSvc.dismiss;
    }
  };
});


angular.module('coreos.services')
.factory('toastSvc', function($timeout) {
  'use strict';

  var AUTO_DISMISS_TIME = 5000,
      service,
      lastTimeoutPromise;

  function dequeue() {
    if (service.messages.length) {
      service.messages.shift();
    }
  }

  function enqueue(type, text) {
    service.messages.push({
      type: type,
      text: text
    });
    lastTimeoutPromise = $timeout(dequeue, AUTO_DISMISS_TIME);
  }

  function cancelTimeout() {
    if (lastTimeoutPromise) {
      $timeout.cancel(lastTimeoutPromise);
    }
  }

  service = {

    messages: [],

    error: enqueue.bind(null, 'error'),

    info: enqueue.bind(null, 'info'),

    dismiss: function(index) {
      cancelTimeout();
      service.messages.splice(index, 1);
    },

    dismissAll: function() {
      cancelTimeout();
      service.messages.length = 0;
    }

  };

  return service;

});
