/**
 * @fileoverview
 * Inject favicons into the <head>.
 * Only use on <head> tag.
 */


angular.module('coreos.ui')

.directive('coFavicons', function($compile, $rootScope, configSvc) {
  'use strict';
  /*eslint max-len:0 */

  return {
    restrict: 'A',
    replace: true,
    link: function postLink(scope, elem) {
      var newScope = $rootScope.$new(),
      htmlTemplate =
        '<link rel="apple-touch-icon-precomposed" sizes="144x144" href="{{path}}/apple-touch-icon-144-precomposed.png">' +
        '<link rel="apple-touch-icon-precomposed" sizes="114x114" href="{{path}}/apple-touch-icon-114-precomposed.png">' +
        '<link rel="apple-touch-icon-precomposed" sizes="72x72" href="{{path}}/apple-touch-icon-72-precomposed.png">' +
        '<link rel="apple-touch-icon-precomposed" href="{{path}}/apple-touch-icon-57-precomposed.png">' +
        '<link rel="shortcut icon" href="{{path}}/favicon.png">';
      newScope.path = configSvc.get('libPath') + '/img';
      elem.append($compile(htmlTemplate)(newScope));
    }
  };

});

/*
*/
