/**
 * Good enough URL parser.
 * Currently does not handle query string params, user/pass, or fragments.
 */
angular.module('coreos.services')
.factory('urlSvc', function() {
  'use strict';

  var urlSvc = {};

  urlSvc.parse = function(str) {
    var s = str,
        empty = urlSvc.create(),
        url = urlSvc.create();

    if (!str) {
      return empty;
    }

    // parse required scheme
    s = s.split('://');
    if (s.length !== 2 || s[1] === '') {
      return empty;
    }
    url.scheme = s[0];
    s = s[1];

    function parsePath(partsAry) {
      if (!partsAry || !partsAry.length) {
        return '';
      }
      return '/' + partsAry.join('/');
    }

    // host + port
    s = s.split(':');
    if (s.length === 2) {
      // hast port
      url.host = s[0];
      s = s[1].split('/');
      url.port = s.shift();
      url.path = parsePath(s);
    } else {
      url.port = '80';
      s = s[0].split('/');
      url.host = s.shift();
      url.path = parsePath(s);
    }

    url.valid = true;
    return url;
  };

  urlSvc.create = function() {
    return {
      scheme: '',
      host: '',
      port: '',
      path: '',
      valid: false,
    };
  };

  return urlSvc;

});
