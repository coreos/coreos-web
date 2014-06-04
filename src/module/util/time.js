'use strict';

angular.module('coreos.services')
.factory('timeSvc', function(_, moment) {

  var ONE_MINUTE_IN_MS = 60 * 1000,
      ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60,
      ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24,
      ONE_WEEK_IN_MS = ONE_DAY_IN_MS * 7,
      THIRTY_DAYS_IN_MS = ONE_DAY_IN_MS * 30;

  function getTimestamp(val) {
    if (val && _.isNumber(val)) {
      return val;
    }
    return Date.now();
  }

  return {
    ONE_MINUTE_IN_MS: ONE_MINUTE_IN_MS,
    ONE_HOUR_IN_MS: ONE_HOUR_IN_MS,
    ONE_DAY_IN_MS: ONE_DAY_IN_MS,
    ONE_WEEK_IN_MS: ONE_WEEK_IN_MS,
    THIRTY_DAYS_IN_MS: THIRTY_DAYS_IN_MS,

    milliToSecs: function(ms) {
      return Math.floor(ms / 1000);
    },

    secsToMins: function(secs) {
      return Math.floor(parseInt(secs, 10) / 60) || 0;
    },

    minsToSecs: function(mins) {
      return Math.abs(parseInt(mins, 10) * 60) || 0;
    },

    minsToMillis: function(mins) {
      return this.minsToSecs(mins) * 1000;
    },

    oneHourAgo: function(ts) {
      return getTimestamp(ts) - this.ONE_HOUR_IN_MS;
    },

    oneDayAgo: function(ts) {
      return getTimestamp(ts) - this.ONE_DAY_IN_MS;
    },

    oneWeekAgo: function(ts) {
      return getTimestamp(ts) - this.ONE_WEEK_IN_MS;
    },

    thirtyDaysAgo: function(ts) {
      return getTimestamp(ts) - this.THIRTY_DAYS_IN_MS;
    },

    getRelativeTimestamp: function(term) {
      var now = Date.now();
      switch(term) {
        case 'month':
          return this.thirtyDaysAgo(now);
        case 'week':
          return this.oneWeekAgo(now);
        case 'day':
          return this.oneDayAgo(now);
        case 'hour':
          return this.oneHourAgo(now);
      }
    },

    utcToLocal: function(date) {
      // Parse a variety of input types via moment.
      var d = moment(date);
      return new Date(d.valueOf() - this.minsToMillis(d.zone()));
    },

    localToUtc: function(date) {
      // Parse a variety of input types via moment.
      var d = moment(date);
      return new Date(d.valueOf() + this.minsToMillis(d.zone()));
    }

  };

});
