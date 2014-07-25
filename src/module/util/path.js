angular.module('coreos.services')
.factory('pathSvc', function(_) {
  'use strict';

  return {

    /**
     * Safely creates a path string.
     */
    join: function() {
      var parts = _.toArray(arguments);
      parts = parts.map(function(p) {
        return _.str.trim(_.str.clean(p), '/');
      });
      return parts.join('/');
    }

  };

});
