angular.module('coreos.filters')
.filter('orderObjectBy', function() {
  'use strict';

  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return reverse ? (a[field] < b[field]) : (a[field] > b[field]);
    });
    return filtered;
  };
});
