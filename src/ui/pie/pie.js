/**
 * @fileoverview
 * A pie chart.
 */

'use strict';

angular.module('coreos.ui')
.directive('coPie', function(d3, _) {

  // Default settings.
  var settings = {
    width: 300,
    height: 200,
    radius: 40,
    duration: 1000,
    colorScale: d3.scale.category10()
  };

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  return {
    templateUrl: '/coreos.ui/pie/pie.html',
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      // The original source data to graph.
      values: '=',
      idField: '@',
      valueField: '@',
      labelField: '@',
      width: '@',
      height: '@',
      radius: '@',
      duration: '@',
      colorScale: '='
    },
    link: function(scope, elem) {
      var el = {},
          innerArc,
          outerArc,
          pie,
          keyFn,
          valueFn,
          labelFn;

      function setNumIfExists(field) {
        if (scope[field] && scope[field] !== '') {
          settings[field] = parseInt(scope[field], 10);
        }
      }

      setNumIfExists('width');
      setNumIfExists('height');
      setNumIfExists('radius');
      setNumIfExists('duration');

      if (scope.colorScale) {
        settings.colorScale = scope.colorScale;
      }

      innerArc = d3.svg.arc()
        .outerRadius(settings.radius)
        .innerRadius(settings.radius * 0.6);

      outerArc = d3.svg.arc()
        .innerRadius(settings.radius)
        .outerRadius(settings.radius);

      keyFn = function(d) {
        return d.data[scope.idField];
      };

      valueFn = function(d) {
        return d.data[scope.valueField];
      };

      labelFn = function(d) {
        return d.data[scope.labelField];
      };

      pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
          return d[scope.valueField];
        });

      // Render initial DOM.
      el.svg = d3.select(elem[0])
        .append('svg')
          .attr('width', settings.width)
          .attr('height', settings.height)
        .append('g')
          .attr('transform',
              'translate(' + settings.width / 2 + ',' +
                settings.height / 2 + ')');

      el.slices = el.svg.append('g')
        .attr('class', 'co-m-pie__slices');
      el.labels = el.svg.append('g')
        .attr('class', 'co-m-pie__labels');
      el.lines = el.svg.append('g')
        .attr('class', 'co-m-pie__lines');

      function updateSlices() {
        var slice = el.slices.selectAll('path')
          .data(pie(scope.values), keyFn);

        slice.enter()
          .insert('path')
          .style('fill', function(d) {
            return settings.colorScale(keyFn(d));
          });

        slice
          .transition().duration(settings.duration)
          .attrTween('d', function(d) {
            var interpolate;
            this._current = this._current || d;
            interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return innerArc(interpolate(t));
            };
          });

        slice.exit()
          .remove();
      }

      function updateLabels() {
        var text = el.labels.selectAll('text')
          .data(pie(scope.values), keyFn);

        text.enter()
          .append('text')
          .attr({
            'dy': '.35em'
          });

        text.text(function(d) {
          return labelFn(d) + ' - ' + valueFn(d);
        });

        text.transition().duration(settings.duration)
          .attrTween('transform', function(d) {
            var interpolate;
            this._current = this._current || d;
            interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = settings.radius * 1.1 * (midAngle(d2) < Math.PI ?
                1 :
                -1);
              return 'translate('+ pos +')';
            };
          })
          .styleTween('text-anchor', function(d){
            var interpolate;
            this._current = this._current || d;
            interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? 'start' : 'end';
            };
          });

        text.exit()
          .remove();
      }

      function updatePolyLines() {
        var polyline = el.lines.selectAll('polyline')
          .data(pie(scope.values), keyFn);

        polyline.enter()
          .append('polyline');

        polyline.transition().duration(settings.duration)
          .attrTween('points', function(d) {
            var interpolate;
            this._current = this._current || d;
            interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t),
                  pos = outerArc.centroid(d2);
              pos[0] = settings.radius * 0.95 *
                (midAngle(d2) < Math.PI ? 1 : -1);
              return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
            };
          });

        polyline.exit()
          .remove();
      }

      function update() {
        updateSlices();
        updateLabels();
        updatePolyLines();
      }

      elem.on('$destroy', function() {
        el.svg.remove();
      });

      scope.$watch('values', function(values) {
        if (!_.isEmpty(values)) {
          update();
        }
      }, true);

    }
  };

});
