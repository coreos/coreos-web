describe('coreos.services.util.pathSvc', function() {
  'use strict';
  var pathSvc;

  // Load the module.
  beforeEach(module('coreos.services'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_pathSvc_) {
    pathSvc = _pathSvc_;
  }));

  it('joins simple strings', function() {
    expect(pathSvc.join('a', 'b', 'c')).toEqual('a/b/c');
  });

  it('joins strings that are already paths', function() {
    expect(pathSvc.join('a/b/c', 'd', 'e')).toEqual('a/b/c/d/e');
  });

  it('trims excess slashes', function() {
    expect(pathSvc.join('/a/', '/b/', '/c/')).toEqual('a/b/c');
  });

});
