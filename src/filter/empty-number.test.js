describe('coreos.filters.coEmptyNumber', function() {
  'use strict';

  var coEmptyNumberFilter,
      defaultText = '&ndash;';

  // Load the module.
  beforeEach(module('coreos.filters'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_coEmptyNumberFilter_) {
    coEmptyNumberFilter = _coEmptyNumberFilter_;
  }));

  it('returns default text when null', function() {
    expect(coEmptyNumberFilter(null)).toBe(defaultText);
  });

  it('returns default text when undefined', function() {
    expect(coEmptyNumberFilter(undefined)).toBe(defaultText);
  });

  it('returns default text when NaN', function() {
    expect(coEmptyNumberFilter(NaN)).toBe(defaultText);
  });

  it('returns actual value when zero', function() {
    expect(coEmptyNumberFilter(0)).toBe('0');
  });

  it('returns actual value when non-zero', function() {
    expect(coEmptyNumberFilter(1)).toBe('1');
  });

  it('returns actual value when less than zero', function() {
    expect(coEmptyNumberFilter(-1)).toBe('-1');
  });

  it('returns a custom default text', function() {
    expect(coEmptyNumberFilter(null, 'custom')).toBe('custom');
  });

});
