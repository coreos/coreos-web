/**
 * @fileoverview
 *
 * Utility service that scrolls elements into view.
 */

angular.module('coreos.services')
.factory('scrollerSvc', function($timeout, $) {
  'use strict';

  function scroll(elem) {
    elem.first()[0].scrollIntoView();
  }

  var scrollerSvc = {

    /**
     * Scroll to the element on the page with matching id.
     * Adds and removes highlight classes too.
     *
     * @param {String|Element} elemOrSelector
     */
    scrollTo: function(elemOrSelector) {
      var maxTries = 100,
          numTries = 0,
          interval = 10,
          elem;

      if (!elemOrSelector) {
        return;
      }

      // Wait for element to appear in DOM if it doesn't exist yet,
      // then scroll to it.
      function attemptScroll() {
        elem = $(elemOrSelector);
        if (numTries < maxTries) {
          if (!elem.length) {
            numTries++;
            $timeout(attemptScroll, interval);
          } else {
            scroll(elem);
          }
        }
      }

      $timeout(attemptScroll, 0);
    }

  };

  return scrollerSvc;

});
