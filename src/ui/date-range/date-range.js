// TODO: input validation
// TODO: fork angular-ui and add option to disable month & year modes
// TODO: opitonally hide/disable end-date all together?


/**
 * Date dropdown selector.
 */
angular.module('coreos.ui')
.directive('coDateRange', function(_, $modal, d3, moment, timeSvc) {

  'use strict';

  var modalConfig = {
    templateUrl: '/coreos.ui/date-range/custom.html',
    controller: 'DateRangeCustomCtrl'
  };

  return {
    templateUrl: '/coreos.ui/date-range/date-range.html',
    restrict: 'E',
    replace: true,
    scope: {
      start: '=',
      end: '=',
      period: '=',
      utc: '@'
    },
    link: function(scope) {
      var dateFmt = 'MMM DD h:mma';

      function get(value) {
        return _.findWhere(scope.items, { value: value });
      }

      if (scope.utc === 'false') {
        scope.utc = false;
      } else {
        scope.utc = true;
      }

      scope.items = [
        {
          value: 'hour',
          label: '1 Hour',
          order: 1
        },
        {
          value: 'day',
          label: '1 Day',
          order: 2
        },
        {
          value: 'week',
          label: '7 Days',
          order: 3
        },
        {
          value: 'month',
          label: '30 Days',
          order: 4
        }
      ];

      if (!scope.period) {
        scope.period = 'day';
      }

      scope.select = function(period) {
        scope.period = period;
      };

      scope.openModal = function() {
        modalConfig.resolve = {
          start: d3.functor(scope.start),
          end: d3.functor(scope.end),
          utc: d3.functor(scope.utc)
        };
        $modal.open(modalConfig)
          .result.then(function(customRange) {
            var startDisplayDate, endDisplayDate, suffix;
            scope.utc = customRange.utc;
            scope.start = customRange.start;
            scope.end = customRange.end;
            scope.period = 'custom';
            if (scope.utc) {
              suffix = ' UTC';
              // convert to local date just for display.
              startDisplayDate = moment(timeSvc.utcToLocal(scope.start));
              endDisplayDate = moment(timeSvc.utcToLocal(scope.end));
            } else {
              suffix = '';
              startDisplayDate = moment(scope.start);
              endDisplayDate = moment(scope.end);
            }
            scope.btnText = startDisplayDate.format(dateFmt);
            if (scope.utc && !scope.end) {
              scope.btnText += suffix;
            }
            scope.btnText += ' - ';
            if (scope.end) {
              scope.btnText += endDisplayDate.format(dateFmt) + suffix;
            } else {
              scope.btnText += 'Latest';
            }
          });
      };

      scope.$watch('period', function(period) {
        if (!period || period === 'custom') {
          return;
        }
        scope.start = timeSvc.getRelativeTimestamp(get(period).value);
        scope.end = null;
        scope.btnText = get(period).label;
      });

    }
  };

})


/**
 * Controller for modal to select custom date range.
 */
.controller('DateRangeCustomCtrl', function($scope, $modalInstance, timeSvc,
      moment, start, end, utc) {
  'use strict';

  $scope.utc = utc;
  $scope.dateFmt = 'MMM dd';
  $scope.timeFmt = 'h:mm a';
  $scope.minDate = new Date(timeSvc.thirtyDaysAgo());
  // Settings for the angular.ui datepicker.
  $scope.dpSettings = {
    startDateIsOpen: false,
    endDateIsOpen: false
  };
  // All the user input fields.
  $scope.inputs = {};

  if (start) {
    $scope.inputs.startDate = new Date(start);
  } else {
    $scope.inputs.startDate = new Date();
  }

  if (end) {
    $scope.inputs.endDate = new Date(end);
  } else {
    $scope.inputs.endDate = null;
  }

  if ($scope.utc) {
    $scope.inputs.startDate = timeSvc.utcToLocal($scope.inputs.startDate);
    if ($scope.inputs.endDate) {
      $scope.inputs.endDate = timeSvc.utcToLocal($scope.inputs.endDate);
    }
  }

  $scope.inputs.startTime = moment($scope.inputs.startDate)
      .format($scope.timeFmt);
  if ($scope.inputs.endDate) {
    $scope.inputs.endTime = moment($scope.inputs.endDate)
      .format($scope.timeFmt);
  }


  function inputsToDate(date, time) {
    var result, tempDate;
    if (!date) {
      return null;
    }
    // Date portion of input date only (ignore time).
    tempDate = moment(date);
    // Result is output of parsing the date + time formatted string.
    result = moment(tempDate.format('YYYY-MM-DD') + ' ' + time,
        'YYYY-MM-DD h:mm a');
    if ($scope.utc) {
      result = timeSvc.localToUtc(result.valueOf());
    }
    return result.valueOf();
  }

  $scope.openDatePicker = function(which, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (which === 'start') {
      $scope.dpSettings.startDateIsOpen = true;
    } else if (which === 'end') {
      $scope.dpSettings.endDateIsOpen = true;
    }
  };

  $scope.$watch('utc', function(utc) {
    if (utc) {
      $scope.toggleUtcText = 'using UTC time';
    } else {
      $scope.toggleUtcText = 'using Local time';
    }
  });

  $scope.toggleUtc = function() {
    $scope.utc = !$scope.utc;
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.resetEnd = function() {
    $scope.inputs.endDate = null;
    $scope.inputs.endTime = null;
  };

  $scope.submit = function() {
    $modalInstance.close({
      start: inputsToDate($scope.inputs.startDate, $scope.inputs.startTime),
      end: inputsToDate($scope.inputs.endDate, $scope.inputs.endTime),
      utc: $scope.utc
    });
  };

})

/**
 * Dumb pass thru controller to get angular forms to work with modal.
 */
.controller('DateRangeCustomFormCtrl', function($scope) {
  'use strict';
  $scope.submitForm = function() {
    $scope.submit();
  };
});
