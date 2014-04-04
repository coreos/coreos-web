/**
 * @fileoverview
 *
 * Simply inject this service to start broadcasting events.
 * It will feature-detect any available browser visibility api.
 * If the feature exists it will broadcast an event when browser visibiltiy
 * changes.
 */

'use strict';

angular.module('coreos.services')
.factory('documentVisibilitySvc', function($rootScope, $document, _,
      CORE_EVENT) {

  var document = $document[0],
      features,
      detectedFeature;

  function broadcastChangeEvent() {
    $rootScope.$broadcast(CORE_EVENT.DOC_VISIBILITY_CHANGE,
        document[detectedFeature.propertyName]);
  }

  features = {
    standard: {
      eventName: 'visibilitychange',
      propertyName: 'hidden'
    },
    moz: {
      eventName: 'mozvisibilitychange',
      propertyName: 'mozHidden'
    },
    ms: {
      eventName: 'msvisibilitychange',
      propertyName: 'msHidden'
    },
    webkit: {
      eventName: 'webkitvisibilitychange',
      propertyName: 'webkitHidden'
    }
  };

  Object.keys(features).some(function(feature) {
    if (_.isBoolean(document[features[feature].propertyName])) {
      detectedFeature = features[feature];
      return true;
    }
  });

  if (detectedFeature) {
    $document.on(detectedFeature.eventName, broadcastChangeEvent);
  }

  return {

    /**
     * Is the window currently hidden or not.
     */
    isHidden: function() {
      if (detectedFeature) {
        return document[detectedFeature.propertyName];
      }
    }

  };

});
