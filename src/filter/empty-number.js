angular.module('coreos.filters').filter('coEmptyNumber', function(_) {
  'use strict';

  /**
   * Replaces an expected numeric value with the default text if the value is
   * not a number.
   */
  return function(val, text) {
    var defaultText = '&ndash;',
        replacementText = text || defaultText;
    if (_.isNaN(val) || _.isNull(val) || _.isUndefined(val)) {
      return replacementText;
    }
    return val.toString();
  };

});
