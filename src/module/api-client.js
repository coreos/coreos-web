'use strict';

angular.module('coreos.services').provider('apiClient', function() {
  var settings = {},
      clientsCache = {};

  // Provider configuration methods.
  this.settings = function(newSettings) {
    if (!newSettings) {
      return settings;
    }
    settings = newSettings;
  };

  // Main factory method.
  this.$get = function apiClientFactory($q, $http, coLocalStorage, pathSvc, _) {

    // Change underscore's template settings for path interpolation.
    _.templateSettings = {
      interpolate : /\{(.+?)\}/g
    };

    function prefixCacheKey(key) {
      return (settings.cachePrefix || 'coreos.') + key;
    }

    // Always assumes json values.
    function getCache(key) {
      var value;
      if (!settings.cache) {
        return null;
      }
      value = coLocalStorage.getItem(prefixCacheKey(key));
      if (value) {
        return JSON.parse(value);
      }
    }

    // Always assumes json values.
    function setCache(key, value) {
      if (!settings.cache) {
        return;
      }
      coLocalStorage.setItem(prefixCacheKey(key), JSON.stringify(value));
    }

    function getApiSettings(name) {
      return _.findWhere(settings.apis, { name: name });
    }

    function getDiscoveryDoc(apiSettings) {
      var endpoint, deferred, localJson;
      deferred = $q.defer();
      endpoint = apiSettings.discoveryEndpoint;
      localJson = getCache(endpoint);
      if (localJson) {
        deferred.resolve(localJson);
      } else {
        $http.get(endpoint, { cache: false })
          .success(function(discoveryJson) {
            setCache(endpoint, discoveryJson);
            deferred.resolve(discoveryJson);
          })
          .error(function(err) {
            deferred.reject('discovery json doc load error', err);
          });
      }
      return deferred.promise;
    }

    function generateClient(apiSettings) {

      function Client(apiMeta) {
        this.apiMeta = apiMeta;
        this.defaultParams = null;
        // generate helper methods
        this.extend_(this, apiMeta.methods || {}, apiMeta.resources || {});
      }

      Client.prototype.getName = function() {
        return this.apiMeta.name;
      };

      Client.prototype.getVersion = function() {
        return this.apiMeta.version;
      };

      Client.prototype.extend_ = function(root, methods, resources) {
        Object.keys(methods).forEach(function(methodName) {
          root[methodName] = this.generateHelper_(methods[methodName]);
        }, this);

        Object.keys(resources).forEach(function(key) {
          root[key] = root[key] || {};
          this.extend_(
            root[key],
            resources[key].methods || {},
            resources[key].resources || {});
        }, this);
      };

      /**
       * Given a method parameter definition and a single obj literal of args,
       * parse the args out into the correct section: path, body, query.
       */
      function parseArgs(paramMap, args) {
        var results = {
          path: {},
          query: {},
          body: {}
        };
        if (_.isEmpty(args)) {
          return results;
        }
        if (_.isEmpty(paramMap)) {
          results.body = args;
          return results;
        }
        _.each(args, function(value, key) {
          var paramType;
          if (paramMap[key] && paramMap[key].location) {
            paramType = paramMap[key].location;
          } else {
            // if not a path or query param it must be in the body
            paramType = 'body';
          }
          _.extend(results[paramType], _.pick(args, key));
        });
        return results;
      }

      Client.prototype.generateHelper_ = function(methodMeta) {
        return function(args, customConfig) {
          var url, parsedArgs, config;
          parsedArgs = parseArgs(methodMeta.parameters, args);
          url = pathSvc.join(
              apiSettings.rootUrl || this.apiMeta.rootUrl,
              apiSettings.servicePath || this.apiMeta.servicePath,
              methodMeta.path);
          if (!_.isEmpty(parsedArgs.path)) {
            // Lazliy create and cache the path interpolation function.
            if (!methodMeta.interpolate_) {
              methodMeta.interpolate_ = _.template(url);
            }
            url = methodMeta.interpolate_(parsedArgs.path);
          }
          config = {
            method: methodMeta.httpMethod,
            url: url,
            params: _.isEmpty(parsedArgs.query) ? null : parsedArgs.query,
            data: _.isEmpty(parsedArgs.body) ? null : parsedArgs.body,
            description: methodMeta.description
          };
          if (customConfig) {
            _.extend(config, customConfig);
          }
          return $http(config);
        }.bind(this);
      };

      return getDiscoveryDoc(apiSettings)
        .then(function(discoveryDoc) {
          var client = new Client(discoveryDoc);
          // Cache for future use.
          clientsCache[apiSettings.id] = client;
          return client;
        });
    }

    return {

      get: function(name) {
        var deferred, apiSettings;
        deferred = $q.defer();
        apiSettings = getApiSettings(name);
        if (clientsCache[apiSettings.id]) {
          deferred.resolve(clientsCache[apiSettings.id]);
          return deferred.promise;
        }
        return generateClient(apiSettings);
      }

    };

  };

});
