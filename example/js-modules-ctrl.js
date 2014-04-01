'use strict';

angular.module('app')
.controller('JsModulesCtrl', function($scope, $q, $timeout, toastSvc) {

  // toast
  $scope.toastSvc = toastSvc;

  // cog
  $scope.cogOptions = [
    {
      'label': 'home link',
      'href': '/example',
      'weight': 100
    },
    {
      'label': 'callback function',
      'callback': function() {
        alert('executed callback');
      },
      'weight': 200
    }
  ];

  // btn-bar
  $scope.generateBtnBarPromise = function() {
    var d = $q.defer();
    $scope.btnBarPromise = d.promise;
    $timeout(d.reject, 2000);
  };

  // error-message
  $scope.generateErrorMessagePromise = function() {
    var d = $q.defer();
    $scope.errorMessagePromise = d.promise;
    $timeout(d.reject, 2000);
  };

});
