/**
 * @fileoverview
 *
 * Service for working with cookies since angular's built-in cookie service
 * leaves much to be desired.
 */

'use strict';

angular.module('coreos.services').factory('cookieSvc',
    function($window, timeSvc) {

  return {

    /**
     * Create a new cookie.
     */
    create: function(name, value, daysUtilExpires) {
      var date, expires;
      if (daysUtilExpires) {
        date = new Date();
        date.setTime(date.getTime() +
            (daysUtilExpires * timeSvc.ONE_DAY_IN_MS));
        expires = '; expires=' + date.toGMTString();
      }
      else {
        expires = '';
      }
      $window.document.cookie = name + '=' + value + expires + '; path=/';
    },

    /**
     * Retrieve a cookie by name.
     */
    get: function(name) {
      var nameEq, cookieList, i, cookieStr;
      nameEq = name + '=';
      cookieList = $window.document.cookie.split(';');
      for (i = 0; i < cookieList.length; i++) {
        cookieStr = cookieList[i];
        while (cookieStr.charAt(0) === ' ') {
          cookieStr = cookieStr.substring(1, cookieStr.length);
        }
        if (cookieStr.indexOf(nameEq) === 0) {
          return cookieStr.substring(nameEq.length, cookieStr.length);
        }
      }
      return null;
    },

    /**
     * Delete a cookie by name.
     */
    remove: function(name) {
      this.create(name, '', -1);
    }

  };

});
