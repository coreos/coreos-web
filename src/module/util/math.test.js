describe('coreos.services.util.mathSvc', function() {
  'use strict';
  var mathSvc;

  // Load the module.
  beforeEach(module('coreos.services'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_mathSvc_) {
    mathSvc = _mathSvc_;
  }));

  it('adds arbitrary number arguments', function() {
    expect(mathSvc.sum(1, 2, 3)).toBe(6);
  });

  it('adds an array of numbers', function() {
    expect(mathSvc.sum([1, 2, 3])).toBe(6);
  });

});
