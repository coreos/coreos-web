'use strict';

angular.module('coreos.events').constant('CORE_EVENT', {
  PAGE_NOT_FOUND: 'core.event.page_not_found',
  BREAKPOINT: 'core.event.breakpoint',
  RESP_ERROR: 'core.event.resp_error',
  RESP_MUTATE: 'core.event.resp_mutate',
  DOC_VISIBILITY_CHANGE: 'core.event.doc_visibility_change',
  POLL_ERROR: 'core.event.poll_error',
  LOCAL_STORAGE_CHANGE: 'core.event.local_storage_change'
});
