angular.module('coreos.services')
.factory('stringSvc', function() {
  'use strict';

  function trim(str, characters) {
    var chars = characters || '\\s';
    return str.replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
  }

  return {

    // Trim beginning and trailing whitespace.
    trim: trim,

    // Trim and replace multiple spaces with a single space.
    clean: function(str) {
      return trim(str).replace(/\s+/g, ' ');
    },

  };

});
