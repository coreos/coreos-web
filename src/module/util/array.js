'use strict';

angular.module('coreos.services')
.factory('arraySvc', function() {

  return {

    /**
     * Remove first occurance of an item from an array in-place.
     *
     * @param {Arrray} ary Array to mutate.
     * @param {*} item Array item to remove.
     * @return {Array} The input array.
     */
    remove: function(ary, item) {
      var index;
      if (!ary || !ary.length) {
        return [];
      }
      index = ary.indexOf(item);
      if (index > -1) {
        ary.splice(index, 1);
      }
      return ary;
    }

  };

});
