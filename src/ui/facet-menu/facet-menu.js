'use strict';

angular.module('coreos.ui')
.directive('coFacetMenu', function() {
  return {
    templateUrl: '/coreos.ui/facet-menu/facet-menu.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      title: '@',
      model: '='
    },
    controller: function($scope) {
      this.getValue = function() {
        return $scope.model;
      };
      this.setValue = function(val) {
        $scope.model = val;
      };
    }
  };
})


.directive('coFacetMenuOption', function() {
  return {
    templateUrl: '/coreos.ui/facet-menu/facet-menu-option.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    require: '^coFacetMenu',
    scope: {
      value: '@'
    },
    link: function(scope, elem, attr, facetMenuCtrl) {
      elem.on('click', function(e) {
        scope.$apply(function() {
          facetMenuCtrl.setValue(scope.value);
        });
        e.preventDefault();
        e.stopPropagation();
      });

      scope.$watch(function() {
        return facetMenuCtrl.getValue();
      }, function(val) {
        scope.isActive = scope.value === val;
      });
    }
  };
});
