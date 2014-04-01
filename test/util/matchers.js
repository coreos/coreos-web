'use strict';

beforeEach(function() {

  this.addMatchers({

    toBeOfType: function(type) {
      this.message = function () {
        return [
          'Expected to be of type: ' + type + '.',
          'Expected not to be of type: ' + type + '.'
        ];
      };
      return typeof this.actual === type;
    }

  });

});
