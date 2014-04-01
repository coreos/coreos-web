'use strict';

angular.module('coreos.ui')
.directive('coTextCopy', function() {

  return {
    restrict: 'A',
    replace: true,
    link: function(scope, elem) {
      function onClickHandler(event) {
        elem.select();
        event.preventDefault();
        event.stopPropagation();
      }
      elem.on('click', onClickHandler);
      elem.on('$destroy', function() {
        elem.off('click', onClickHandler);
      });
    }
  };

});
