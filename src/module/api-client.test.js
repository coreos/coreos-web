describe('coreos.services.apiClient', function () {
  'use strict';

  var $q, $timeout, $httpBackend, apiClientProvider, apiClient, mockPromise,
    mockDiscoJson,
    discoUrl = 'http://mock.com/example/discovery.json',
    settingsObj = {
      apis: [{
        name: 'mockApi',
        id: 'mock:v1',
        discoveryEndpoint: discoUrl
      }]
    };

  beforeEach(function () {
    // Initialize the service provider by injecting it to a fake module's
    // config block.
    angular.module('testApp', function () {})
      .config(function(_apiClientProvider_) {
        apiClientProvider = _apiClientProvider_;
        apiClientProvider.settings(settingsObj);
      });

    // Initialize coreos.services injector
    module('coreos.services', 'testApp', 'mocks');

    // Kickstart the injectors previously registered with angular.mock.module.
    // Inject instance of service.
    inject(function($injector) {
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
      $httpBackend = $injector.get('$httpBackend');
      mockPromise = $injector.get('mocks.promise');
      mockDiscoJson = $injector.get('mocks.discovery');
      apiClient = $injector.get('apiClient');
    });

  });

  it('sets/gets the settings object on the provider', function () {
    expect(apiClientProvider.settings()).toBe(settingsObj);
  });

  describe('get()', function() {
    var client;

    beforeEach(function() {
      $httpBackend.when('GET', discoUrl).respond(function() {
        return [200, mockDiscoJson];
      });
      apiClient.get('mockApi')
        .then(function(c) {
          client = c;
        });
    });

    afterEach(function() {
      client = null;
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('fetches the discovery json', function() {
      $httpBackend.expectGET(discoUrl);
      $httpBackend.flush();
    });

    it('builds the client with the correct methods', function() {
      $httpBackend.flush();
      expect(client).toBeDefined();
      expect(client.users.list).toBeDefined();
      expect(client.users.get).toBeDefined();
      expect(client.users.destroy).toBeDefined();
    });

  });

});
