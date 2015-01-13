angular.module('coreos.services').provider('configSvc', function() {
  'use strict';

  var configValues = {};

  this.config = function(newConfig) {
    if (newConfig) {
      configValues = newConfig;
    } else {
      return configValues;
    }
  };

  this.$get = function() {
    return {
      get: function(key) {
        if (key) {
          return configValues[key];
        } else {
          return angular.copy(configValues);
        }
      },

      set: function(key, value) {
        configValues[key] = value;
      }
    };
  };

});
