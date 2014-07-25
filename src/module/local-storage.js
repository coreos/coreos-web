angular.module('coreos.services')
.factory('coLocalStorage', function($rootScope, $window, CORE_EVENT) {
  'use strict';

  return {

    length: $window.localStorage.length,

    getItem: function(key) {
      return $window.localStorage.getItem(key);
    },

    key: function(n) {
      return $window.localStorage.key(n);
    },

    clear: function() {
      $window.localStorage.clear();
      $rootScope.$broadcast(CORE_EVENT.LOCAL_STORAGE_CHANGE, {
        key: '*'
      });
    },

    removeItem: function(key) {
      $window.localStorage.removeItem(key);
      $rootScope.$broadcast(CORE_EVENT.LOCAL_STORAGE_CHANGE, {
        key: key
      });
    },

    setItem: function(key, value) {
      $window.localStorage.setItem(key, value);
      $rootScope.$broadcast(CORE_EVENT.LOCAL_STORAGE_CHANGE, {
        key: key,
        value: value
      });
    }

  };

});
