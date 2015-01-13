/**
 * @fileoverview
 *
 * Utility service to highlight an element or selection of elements.
 * NOTE: Expects a [HIGHLIGHT_CSS_CLASS] class to be defined in constants.
 */

angular.module('coreos.services')
.factory('highlighterSvc', function($timeout, $, CORE_CONST) {
  'use strict';

  var pendingTimeout;

  return {

    /**
     * Highlight an element in the DOM.
     *
     * @param {String|Element} elemOrSelector
     */
    highlight: function(elemOrSelector) {
      var elem;
      if (!elemOrSelector) {
        return;
      }
      elem = $(elemOrSelector);
      if (elem.hasClass(CORE_CONST.HIGHLIGHT_CSS_CLASS)) {
        $timeout.cancel(pendingTimeout);
        elem.removeClass(CORE_CONST.HIGHLIGHT_CSS_CLASS);
      }
      elem.addClass(CORE_CONST.HIGHLIGHT_CSS_CLASS);
      pendingTimeout = $timeout(
          elem.removeClass.bind(elem, CORE_CONST.HIGHLIGHT_CSS_CLASS), 5000);
    }

  };

});
