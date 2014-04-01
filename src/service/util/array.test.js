'use strict';

describe('coreos.services.util.arraySvc', function() {
  var arraySvc, testArray;

  // Load the module.
  beforeEach(module('coreos.services'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_arraySvc_) {
    arraySvc = _arraySvc_;
    testArray = ['a', 'b', 'c', 'a'];
  }));

  it('returns an empty array if passed array is undefined', function() {
    expect(arraySvc.remove()).toEqual([]);
  });

  it('returns an empty array if passed array is null', function() {
    expect(arraySvc.remove(null)).toEqual([]);
  });

  it('removes the first occurance from the array', function() {
    expect(arraySvc.remove(testArray, 'a')).toEqual(['b', 'c', 'a']);
  });

  it('maintains the object reference', function() {
    var result = arraySvc.remove(testArray, 'a');
    expect(result).toBe(testArray);
  });

});
