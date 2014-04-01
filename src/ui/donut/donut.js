/**
 * @fileoverview
 * An arc donut chart.
 */

// TDOO(sym3tri): add hover text.

'use strict';

angular.module('coreos.ui')
.directive('coDonut', function(d3, _) {

  return {

    templateUrl: '/coreos.ui/donut/donut.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      // The original source data to graph.
      percent: '=',
      color: '@'
    },
    controller: function($scope) {
      var outerRadius, circleWidth;
      $scope.width = $scope.height = 80;
      outerRadius = $scope.width / 2;
      circleWidth = 15;
      $scope.arc = d3.svg.arc()
        .innerRadius(outerRadius - circleWidth)
        .outerRadius(outerRadius)
        .startAngle(0);
      // Constant to turn percents into radian angles.
      $scope.tau = 2 * Math.PI;
    },
    link: function(scope, elem) {
      scope.isRendered = false;

      function render() {
        var endAngle = scope.tau, // 100%
            textColor = '#333',
            bgcolor = '#eee',
            color = scope.color || '#000',
            fontSize = 18;

        // Keep track of added DOM elements.
        scope.el = {};

        scope.el.svg = d3.select(elem.find('.co-m-guage__content')[0])
          .append('svg')
          .attr('width', scope.width)
          .attr('height', scope.height)
          .append('g')
            .attr('transform',
                'translate(' +
                scope.width / 2 + ',' +
                scope.height / 2 + ')');

        scope.el.text = scope.el.svg.append('text')
          .attr('fill', textColor)
          .attr('y', Math.floor(fontSize / 3))
          .attr('font-size', fontSize + 'px')
          .attr('text-anchor', 'middle');

        scope.el.arcGroup = scope.el.svg.append('g')
          .attr('transform', 'rotate(180)');

        scope.el.background = scope.el.arcGroup.append('path')
          .datum({
            endAngle: endAngle
          })
          .style('fill', bgcolor)
          .attr('d', scope.arc);

        scope.el.foreground = scope.el.arcGroup.append('path')
          .datum({
            endAngle: scope.tau * (scope.percent || 0)
          })
          .style('fill', color)
          .style('opacity', 0.8)
          .attr('d', scope.arc);

        scope.isRendered = true;
      }

      /**
       * Update the value of the donut chart.
       */
      function updateValue() {
        var displayValue;
        if (_.isNumber(scope.percent)) {
          displayValue = Math.round(scope.percent * 100) + '%';
        } else {
          displayValue = '?';
        }
        scope.el.text.text(displayValue);
        scope.el.foreground.transition()
          .duration(750)
          .call(arcTween, scope.percent * scope.tau);
      }

      /**
       * Transition function to animate the arc.
       */
      function arcTween(transition, newAngle) {
        transition.attrTween('d', function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
            d.endAngle = interpolate(t);
            return scope.arc(d);
          };
        });
      }

      /**
       * Cleanup.
       */
      elem.on('$destroy', function() {
        scope.el.svg.remove();
      });

      if (scope.percent) {
        render();
      }

      scope.$watch('percent', function() {
        if (!scope.isRendered) {
          render();
        } else {
          updateValue();
        }
      });
    }
  };

});
