'use strict';

angular.module('coreos.services', [
  'coreos.events',
  'underscore',
  'jquery'
]);
angular.module('coreos.ui', [
  'coreos.events',
  'underscore',
  'jquery',
  'd3',
  'ui.bootstrap'
]);
angular.module('coreos.filters', []);
angular.module('coreos.events', []);
angular.module('coreos', [
  'coreos.events',
  'coreos.services',
  'coreos.ui',
  'coreos.filters',
  'coreos-templates-html',
  'coreos-templates-svg',

  // External deps.
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ui.bootstrap',
  'underscore',
  'jquery',
  'd3'
])
.config(function($compileProvider) {
  // Allow irc links.
  $compileProvider
    .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|irc):/);
});
