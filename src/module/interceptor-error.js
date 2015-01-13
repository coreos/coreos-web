angular.module('coreos.services')
.factory('interceptorErrorSvc', function($q, $rootScope, CORE_EVENT) {
  'use strict';

  function parseMessage(rejection) {
    var errorMsg;
    if (rejection.config.description) {
      errorMsg = 'Error attempting: ' + rejection.config.description;
    } else {
      errorMsg = 'A network error occurred.';
    }
    return errorMsg;
  }

  return {

    /**
     * For every failing $http request: broadcast an error event.
     */
    'responseError': function(rejection) {
      if (!rejection.config.supressNotifications) {
        $rootScope.$broadcast(CORE_EVENT.RESP_ERROR,
          rejection,
          parseMessage(rejection));
      }
      return $q.reject(rejection);
    }

  };

});
