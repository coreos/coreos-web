'use strict';

angular.module('mocks').value('mocks.promise', {
  catch: function() {
    return this;
  },
  then: function() {
    return this;
  },
  finally: function() {
    return this;
  }
});
