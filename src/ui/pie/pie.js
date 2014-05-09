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
    minPercent: 5,
    whitelist: [],
    colorScale: d3.scale.category10(),
    maxItems: 8
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
      colorScale: '=',
      minPercent: '@',
      // optional comma separated list of keys to not include in "others"
      // grouping
      whitelist: '@'
    },
    link: function(scope, elem) {
      var el = {},
          innerArc,
          outerArc,
          pie;

      function setNumIfExists(field) {
        if (scope[field] && scope[field] !== '') {
          settings[field] = parseInt(scope[field], 10);
        }
      }

      setNumIfExists('width');
      setNumIfExists('height');
      setNumIfExists('radius');
      setNumIfExists('duration');
      setNumIfExists('minPercent');

      if (scope.colorScale) {
        settings.colorScale = scope.colorScale;
      }

      if (scope.whitelist) {
        settings.whitelist = scope.whitelist.split(',');
      }

      innerArc = d3.svg.arc()
        .outerRadius(settings.radius)
        .innerRadius(settings.radius * 0.6);

      outerArc = d3.svg.arc()
        .innerRadius(settings.radius)
        .outerRadius(settings.radius);

      function keyFn(d) {
        return d[scope.idField];
      }

      function keyDataFn(d) {
        return keyFn(d.data);
      }

      function valueFn(d) {
        return d[scope.valueField];
      }

      function valueDataFn(d) {
        return valueFn(d.data);
      }

      function labelFn(d) {
        return d[scope.labelField];
      }

      function orderByLabel(a, b) {
        return d3.ascending(labelFn(a), labelFn(b));
      }

      pie = d3.layout.pie()
        .sort(orderByLabel)
        .value(valueFn);

      // Render initial DOM.
      el.svg = d3.select(elem[0])
        .append('svg')
          .attr('width', settings.width)
          .attr('height', settings.height)
        .append('g')
          .attr('transform',
              'translate(' + settings.width / 2 + ',' +
                settings.height / 2 + ')')
          .on('click', function() {
            console.log(scope.otherValues);
          });

      el.slices = el.svg.append('g')
        .attr('class', 'co-m-pie__slices');
      el.labels = el.svg.append('g')
        .attr('class', 'co-m-pie__labels');
      el.lines = el.svg.append('g')
        .attr('class', 'co-m-pie__lines');

      function updateSlices() {
        var slice = el.slices.selectAll('path')
          .data(pie(scope.pieValues), keyDataFn);

        slice.enter()
          .insert('path')
          .each(function(d) {
            this._current = d;
          })
          .attr({
            'opacity': 0,
            'fill': function(d) {
              return settings.colorScale(keyDataFn(d));
            }
          });

        slice
          .transition().duration(settings.duration)
          .style('opacity', 1)
          .attrTween('d', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return innerArc(interpolate(t));
            };
          });

        slice.exit()
          .transition()
            .delay(0)
            .duration(settings.duration)
          .style('opacity', 0)
          .remove();
      }

      function updateLabels() {
        var text = el.labels.selectAll('text')
          .data(pie(scope.pieValues), keyDataFn);

        text.enter()
          .append('text')
          .each(function(d) {
            this._current = d;
          })
          .attr({
            'dy': '.35em',
            'opacity': 0
          });

        text.text(function(d) {
          return labelFn(d.data) + ' - ' + valueDataFn(d);
        });

        text.transition().duration(settings.duration)
          .style('opacity', 1)
          .attrTween('transform', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = settings.radius * 1.5 * (midAngle(d2) < Math.PI ?
                1 : -1);
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
          .transition()
            .delay(0)
            .duration(settings.duration)
          .style('opacity', 0)
          .remove();
      }

      function updatePolyLines() {
        var polyline = el.lines.selectAll('polyline')
          .data(pie(scope.pieValues), keyDataFn);

        polyline.enter()
          .append('polyline')
          .style('opacity', 0.3)
          .each(function(d) {
            this._current = d;
          });

        polyline.transition().duration(settings.duration)
          .style('opacity', 1)
          .attrTween('points', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t),
                  pos = outerArc.centroid(d2);
              pos[0] = settings.radius * 1.4 *
                (midAngle(d2) < Math.PI ? 1 : -1);
              return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
            };
          });

        polyline.exit()
          .transition()
            .delay(0)
            .duration(settings.duration)
          .style('opacity', 0)
          .remove();
      }

      // Remove all items with value < threshold percent & aggregate into an
      // "others" bucket.
      function bucketOthers() {
        var values, sum, othersItem, others;
        scope.pieValues = values = _.clone(scope.values);
        if (!settings.minPercent || settings.minPercent <= 0 ||
            values.length <=2) {
          return;
        }

        // Compute sum to calculate percentages
        sum = d3.sum(values, valueFn);
        // Prevent divide by zero in loop.
        if (sum <= 0) {
          return;
        }

        // Just for debugging, or to see all "others" items.
        others = [];
        // New item to potentially add to the list.
        othersItem = {};
        othersItem[scope.labelField] = 'other';
        othersItem[scope.valueField] = 0;

        function appendToOthers(item) {
          others.push(item);
          othersItem[scope.valueField] += valueFn(item);
        }

        function bucketLowValues() {
          var mean = d3.mean(values, valueFn),
              currItem,
              i;
          // Scan thru items moving less significant ones to "others" list.
          for (i = 0; i < values.length; i++) {
            currItem = values[i];
            // Skip white-listed items.
            if (_.contains(settings.whitelist, keyFn(currItem))) {
              continue;
            }
            // Skip items above the threshold.
            if ((valueFn(currItem) / sum) * 100 > settings.minPercent) {
              continue;
            }
            // Skip values greater than mean.
            if (valueFn(currItem) >= mean) {
              continue;
            }
            // Add anything else to "others" array.
            appendToOthers(currItem);
            // Delete from main array.
            values.splice(i, 1);
            // Decrement index since we just removed an item from the array.
            i--;
          }
        }

        function trimLength() {
          var sortedValues, i, currItem;
          // If there are still too many items start plucking off values in asc
          // order until the list is small enough.
          if (values.length <= settings.maxItems) {
            return;
          }
          sortedValues = values.sort(function(a, b) {
            return d3.ascending(valueFn(a), valueFn(b));
          });
          i = 0;
          while (values.length > settings.maxItems && i < values.length) {
            currItem = values[i];
            // skip whitelisted items.
            if (_.contains(settings.whitelist, keyFn(currItem))) {
              i++;
              continue;
            }
            // Add to others, and remove from main array.
            appendToOthers(currItem);
            values.splice(values.indexOf(currItem), 1);
          }
        }

        bucketLowValues();
        trimLength();

        // Append an "others" item if needed.
        if (valueFn(othersItem) > 0) {
          values.push(othersItem);
        }

        scope.otherValues = others;
      }

      function update() {
        bucketOthers();
        updateSlices();
        updateLabels();
        updatePolyLines();
      }

      elem.on('$destroy', function() {
        el.svg.remove();
        el.svg.on('click', null);
      });

      scope.$watch('values', function(values) {
        if (!_.isEmpty(values)) {
          update();
        }
      }, true);

    }
  };

});
