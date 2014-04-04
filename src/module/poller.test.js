'use strict';

describe('coreos.services.pollerSvc', function () {


  var pollerSvcProvider, pollerSvc, mockScope, $timeout, mockPromise, $q;

  beforeEach(function () {
    // Initialize the service provider by injecting it to a fake module's
    // config block.
    angular.module('testApp', function () {})
      .config(function(_pollerSvcProvider_) {
        pollerSvcProvider = _pollerSvcProvider_;
      });

    // Initialize coreos.services injector
    module('coreos.services', 'testApp', 'mocks');

    // Kickstart the injectors previously registered with angular.mock.module.
    // Inject instance of poller service.
    inject(function($injector) {
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
      pollerSvc = $injector.get('pollerSvc');
      mockScope = $injector.get('$rootScope').$new();
      mockPromise = $injector.get('mocks.promise');
    });
  });


  it('sets the settings object on the provider', function () {
    var settingsObj = { foo: 'bar' };
    pollerSvcProvider.settings(settingsObj);
    expect(pollerSvcProvider.settings()).toBe(settingsObj);
  });


  describe('isRegistered()', function() {

    it('reports false for unregistered names', function() {
      expect(pollerSvc.isRegistered('idontexist')).toBe(false);
    });

    it('reports true for registered names', function() {
      pollerSvc.register('iexist', {});
      expect(pollerSvc.isRegistered('iexist')).toBe(true);
    });

  });


  describe('register()', function() {
    var options;

    beforeEach(function() {
      options = {};
    });

    it('sets the default options', function() {
      pollerSvc.register('myPoller', options);
      expect(options.startIn).toBe(0);
      expect(options.catch).toBe(angular.noop);
      expect(options.then).toBe(angular.noop);
      expect(options.finally).toBe(angular.noop);
    });

    it('automatically kills the poller when scope is destroyed', function() {
      options.scope = mockScope;
      pollerSvc.register('myPoller', options);
      mockScope.$destroy();
      mockScope.$digest();
      expect(pollerSvc.isRegistered('myPoller')).toBe(false);
    });

    it('runs the specified function', function() {
      options.fn = function() {
        return mockPromise;
      };
      spyOn(options, 'fn').andCallThrough();
      pollerSvc.register('myPoller', options);
      $timeout.flush();
      expect(options.fn).toHaveBeenCalled();
    });

    it('polls', function() {
      var counter = 0;
      options = {
        fn: function() {
          var d = $q.defer();
          if (counter < 10) {
            d.resolve('hi');
          } else {
            pollerSvc.kill('pollingPoller');
          }
          return d.promise;
        },
        then: function() {
          counter++;
        }
      };
      pollerSvc.register('pollingPoller', options);
      $timeout.flush();
      expect(counter).toBe(10);
    });

  });


  describe('kill()', function() {
    var options;

    beforeEach(function() {
      options = {
        fn: function() {
          var d = $q.defer();
          d.resolve('yup');
          return d.promise;
        },
        interval: 10,
        then: jasmine.createSpy()
      };
    });

    it('fails silently if poller doesnt exist', function() {
      expect(pollerSvc.kill.bind(null, 'idontexist')).not.toThrow();
    });

    it('cancels any outstanding timeouts', function() {
      var spinCounter;
      runs(function() {
        spinCounter = 0;
        pollerSvc.register('myPoller', options);
        $timeout.flush();
        pollerSvc.kill('myPoller');
      });
      waitsFor(function() {
        // Spin for a while to see if any operations get queued up.
        spinCounter++;
        return spinCounter === 10;
      }, 0);
      runs(function() {
        expect($timeout.verifyNoPendingTasks).not.toThrow();
      });
    });

    it('deletes the poller from the index', function() {
      pollerSvc.register('myPoller', options);
      pollerSvc.kill('myPoller');
      expect(pollerSvc.isRegistered('myPoller')).toBe(false);
    });

    it('stops polling', function() {
      var counter = 0, spinCounter = 0;
      runs(function() {
        options = {
          fn: function() {
            var d = $q.defer();
            if (counter < 10) {
              d.resolve('hi');
            } else {
              pollerSvc.kill('pollingPoller');
            }
            return d.promise;
          },
          then: function() {
            counter++;
          }
        };
        pollerSvc.register('pollingPoller', options);
        $timeout.flush();
      });

      waitsFor(function() {
        spinCounter++;
        return spinCounter === 20;
      }, 0);

      runs(function() {
        // Should still be 10.
        expect(counter).toBe(10);
      });
    });

  });


  describe('killAll()', function() {
    var options;

    beforeEach(function() {
      options = {};
    });

    it('kills and removes all pollers', function() {
      pollerSvc.register('one', options);
      pollerSvc.register('two', options);
      pollerSvc.register('three', options);
      pollerSvc.killAll();
      expect(pollerSvc.isRegistered('one')).toBe(false);
      expect(pollerSvc.isRegistered('two')).toBe(false);
      expect(pollerSvc.isRegistered('three')).toBe(false);
    });

  });


});
