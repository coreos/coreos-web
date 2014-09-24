/**
 * Adds an active class to <li> tags where a[href] or a[ng-href] matches the
 * current url path. Removes any angular interpolated values.
 *
 * Assumes a structure of:
 *
 * <ul co-nav-active="active-class">
 *  <li><a href="/foo/bar">foo bar</a></li>
 *  <li><a ng-href="/foo/{{f.id}}">foo detail</a></li>
 * </ul>
 */

angular.module('coreos.ui')
.directive('coNavActive', function($, _, $location) {
  'use strict';

  // Regex to match angular interpolation vlues.
  var ngVarMatchRE = /{{2}[^}]*}{2}/g;

  return {
    restrict: 'A',
    link: function postLink(scope, elem, attrs) {

      function isActive(href) {
        var hrefParts, currParts;
        currParts = $location.path().split('/');
        hrefParts = href.replace(ngVarMatchRE, '').split('/');
        if (currParts.length !== hrefParts.length) {
          return false;
        }
        return _.every(currParts, function(part, index) {
          return hrefParts[index] === '' || part === hrefParts[index];
        });
      }

      $('a', elem).each(function() {
        var a = $(this),
            href = a.attr('href') || a.attr('ng-href');
        if (isActive(href)) {
          a.parent().addClass(attrs.coNavActive);
          return;
        }
      });

    }
  };

});
