'use strict';

angular.module('coreos').constant('CORE_CONST', {

  HIGHLIGHT_CSS_CLASS: 'co-an-highlight',

  BREAKPOINTS: [
    {
      name: 'xs',
      min: 0,
      max: 480
    },
    {
      name: 'sm',
      min: 480,
      max: 768
    },
    {
      name: 'md',
      min: 768,
      max: 992
    },
    {
      name: 'lg',
      min: 992,
      max: 1200
    },
    {
      name: 'xl',
      min: 1200,
      max: Infinity
    }
  ]

});
