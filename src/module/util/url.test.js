describe('coreos.services.util.urlSvc', function() {
  'use strict';
  var urlSvc,
      tests;

  // Load the module.
  beforeEach(module('coreos.services'));

  beforeEach(inject(function(_urlSvc_) {
    var emptyURL;
    urlSvc = _urlSvc_;
    emptyURL = urlSvc.create();

    tests = [
      // has everything
      {
        url: 'http://example.com:8080/some/random/path',
        want: {
          scheme: 'http',
          host: 'example.com',
          port: '8080',
          path: '/some/random/path',
          valid: true,
        },
      },
      // no path
      {
        url: 'http://example.com:8080',
        want: {
          scheme: 'http',
          host: 'example.com',
          port: '8080',
          path: '',
          valid: true,
        },
      },
      // no path, default port
      {
        url: 'http://example.com',
        want: {
          scheme: 'http',
          host: 'example.com',
          port: '80',
          path: '',
          valid: true,
        },
      },
      // https
      {
        url: 'https://example.com',
        want: {
          scheme: 'https',
          host: 'example.com',
          port: '80',
          path: '',
          valid: true,
        },
      },
      // default port
      {
        url: 'http://example.com/some/random/path',
        want: {
          scheme: 'http',
          host: 'example.com',
          port: '80',
          path: '/some/random/path',
          valid: true,
        },
      },
      // invalid

      // empty
      {
        url: '',
        want: emptyURL,
      },
      // garbage
      {
        url: 'asdfadsf',
        want: emptyURL,
      },
      // missing host
      {
        url: 'http://',
        want: emptyURL,
      },
      // missing scheme
      {
        url: 'example.com',
        want: emptyURL,
      },
    ];
  }));

  it('parses the url into the expected result', function() {
    tests.forEach(function(t) {
      expect(urlSvc.parse(t.url)).toEqual(t.want);
    });
  });

});
