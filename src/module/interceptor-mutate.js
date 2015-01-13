angular.module('coreos.services')
.factory('interceptorMutateSvc', function($q, $rootScope, CORE_EVENT) {
  'use strict';

  // Remove last path segement of a url.
  function removeLastPath(url) {
    var newUrl = url.split('/');
    newUrl.pop();
    newUrl = newUrl.join('/');
    return newUrl;
  }

  return {

    /**
     * For every successful mutating $http request broadcast the urls.
     * Useful for cache invalidation.
     */
    'response': function(response) {
      var method = response.config.method,
          url = response.config.url,
          cacheKeys;

      if (method !== 'GET') {
        cacheKeys = [];
        cacheKeys.push(url);
        if (method !== 'POST') {
          cacheKeys.push(removeLastPath(url));
        }
        $rootScope.$broadcast(CORE_EVENT.RESP_MUTATE, response);
      }
      return response || $q.when(response);
    }

  };

});
