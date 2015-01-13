/**
 * A general purpose polling service.
 *
 * Provide a series of options with callacks and this service will start a
 * poller for the task.
 *
 * On failure it will try up to `maxRetries`, then will be killed and callback
 * to the `catchMaxFail()` function if provided.
 *
 * Optionally pass in a `scope` associated with the poller to automatically
 * kill the poller when the scope is destroyed.
 *
 * Global settings for this provider can be configured in the app `config`
 * stage. Instance will override defaults if provided ot the `register()`
 * function.
 *
 * EXAMPLE USAGE:
 *
 *    poller.register('myPoller', {
 *      fn: functionToRunRepeadedly,
 *      then: successCallback,
 *      catch: errorCallback,
 *      catchMaxFail: afterMaxFailuresCallback,
 *      scope: $scope,
 *      startIn: 0,
 *      interval: 5000
 *    });
 */

angular.module('coreos.services').provider('pollerSvc', function() {
  'use strict';

  var settings = {},
      pollers = {};

  /**
   * Update global settings for the provider.
   * @param {Object} newSettings
   */
  this.settings = function(newSettings) {
    if (newSettings) {
      settings = newSettings;
    } else {
      return settings;
    }
  };

  /**
   * The main factory method.
   * Dependencies are injected and is invoked by angular.
   */
  this.$get = function pollerFactory($q, $http, $timeout, _, CORE_EVENT) {
    /* jshint unused:false */

    function isRegistered(name) {
      return !!pollers[name];
    }

    /**
     * Schedule the `execute` function to run.
     * @param {Number} delay When to start in ms.
     */
    function schedule(name, executor, delay) {
      var poller = pollers[name];
      if (!poller || poller._errorCount > poller.maxRetries) {
        return;
      }
      poller._state = 'waiting';
      poller._timeoutPromise = $timeout(executor, delay);
    }

    /**
     * Wrap a function to prevent it from running if the current state
     * is "terminated".
     */
    function runIfActive(name, fn) {
      var poller = pollers[name];
      if (!poller) {
        return angular.noop;
      }
      return function() {
        if (poller._state !== 'terminated') {
          return fn.apply(null, arguments);
        }
      };
    }

    function killPoller(name) {
      var poller;
      if (!isRegistered(name)) {
        return;
      }
      poller = pollers[name];
      poller._state = 'terminated';
      // Cancel the interval timer.
      if (poller._timeoutPromise) {
        $timeout.cancel(poller._timeoutPromise);
      }
      // Remove the scope.$destroy handler.
      poller._unlistenDestroy();
      // Delete from the list.
      delete pollers[name];
    }

    /**
     * Create an executor function for a poller with the given name.
     */
    function createExecutor(name) {
      var poller = pollers[name];
      if (!poller) {
        return angular.noop;
      }

      /**
       * The main function that will be run on an interval for a poller.
       * This wraps the user-provided function, executes callbacks after
       * completion, and handles scheduling.
       */
      return function execute() {
        if (poller._paused) {
          schedule(name, poller._executor, poller.interval);
          return;
        }
        poller._state = 'executing';
        poller.fn()
          .then(runIfActive(name, function() {
            poller._state = 'success';
            poller._errorCount = 0;
            poller.then.apply(null, arguments);
          }))
          .catch(runIfActive(name, function() {
            var args;
            poller._state = 'error';
            poller._errorCount += 1;
            poller.catch.apply(null, arguments);
            if (poller._errorCount > poller.maxRetries) {
              args = _.toArray(arguments);
              args.unshift(name);
              poller.catchMaxFail.apply(null, args);
              killPoller(name);
            }
          }))
          .finally(runIfActive(name, function() {
            poller.finally.apply(null, arguments);
            schedule(name, poller._executor, poller.interval);
          }));
      };
    }

    return {

      /**
       * Determines if a poller is already registered by name.
       * @param {String} name
       * @return {Boolean}
       */
      isRegistered: isRegistered,

      /**
       * Register the promise in the index, and schedule it to start polling.
       *
       * @param {String} name The uniqe name to associate with the poller.
       * @param {Object} options
       */
      register: function(name, options) {
        // kill the old poller if one by same name already exists.
        if (isRegistered(name)) {
          this.kill(name);
        }

        // Initialize all poller options.
        _.defaults(options, settings, {
          startIn: 0,
          maxRetries: 0,
          catch: angular.noop,
          then: angular.noop,
          finally: angular.noop,
          catchMaxFail: function() {
            if (options.scope) {
              options.scope.$emit(CORE_EVENT.POLL_ERROR);
            }
          },
          _unlistenDestroy: angular.noop,
          _errorCount: 0,
          _state: 'starting'
        });

        if (options.scope) {
          // If a scope is provided, automatically kill the poller when the
          // scope is destroyed.
          options._unlistenDestroy =
            options.scope.$on('$destroy', this.kill.bind(this, name));

          // When scope is prvided automatically pause polling when tab
          // loses visability.
          // TODO: add pauseAll() function and move this to app.run()
          options.scope.$on(CORE_EVENT.DOC_VISIBILITY_CHANGE,
              function(e, isHidden) {
            if (isHidden) {
              options._paused = true;
            } else {
              options._paused = false;
            }
          });
        }

        // Keep track of the poller in the index.
        pollers[name] = options;

        // Generate the executor wrapper for the poller.
        options._executor = createExecutor(name);

        // Schedule the initial run of the poller.
        schedule(name, options._executor, options.startIn);
      },

      /**
       * Kill a poller by name and remove all references, callbacks, etc.
       * @param {String} name
       */
      kill: function(name) {
        killPoller(name);
      },

      /**
       * Kill all registered pollers.
       */
      killAll: function() {
        Object.keys(pollers).forEach(this.kill.bind(this));
      }

    };

  };

});
