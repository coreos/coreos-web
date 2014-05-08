'use strict';

angular.module('app')
.controller('JsModulesCtrl', function($scope, $q, $timeout, $interval,
      toastSvc) {

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

  $scope.pieData = [
    {
      label: 'Amazon',
      count: 100
    },
    {
      label: 'Google',
      count: 200
    },
    {
      label: 'Rackspace',
      count: 20
    }
  ];

  $interval(function() {
    $scope.pieData[0].count = Math.ceil(Math.random()*100);
    $scope.pieData[1].count = 100 - $scope.pieData[0].count;
  }, 4000);

});
