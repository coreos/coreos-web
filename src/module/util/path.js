angular.module('coreos.services')
.factory('pathSvc', function(_, s) {
  'use strict';

  return {

    /**
     * Safely creates a path string.
     */
    join: function() {
      var parts = _.toArray(arguments);
      parts = parts.map(function(p) {
        return s.trim(s.clean(p), '/');
      });
      return parts.join('/');
    }

  };

});
