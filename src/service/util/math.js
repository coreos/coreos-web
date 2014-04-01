'use strict';

angular.module('coreos.services')
.factory('mathSvc', function(_) {

  return {

    /**
     * If passed an array sums all items in the array.
     * Otherwise sums all arguments together.
     *
     * @param {Array|Number...}
     * @return {Number}
     */
    sum: function() {
      var ary;
      if (_.isArray(arguments[0])) {
        ary = arguments[0];
      } else {
        ary = _.toArray(arguments);
      }
      return ary.reduce(function(prev, curr) {
        return prev + curr;
      }, 0);
    }

  };

});
