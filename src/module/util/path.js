angular.module('coreos.services')
.factory('pathSvc', function(_, stringSvc) {
  'use strict';

  return {

    /**
     * Safely creates a path string.
     */
    join: function() {
      var parts = _.toArray(arguments);
      parts = parts.map(function(p) {
        return stringSvc.trim(stringSvc.clean(p), '/');
      });
      return parts.join('/');
    }

  };

});
