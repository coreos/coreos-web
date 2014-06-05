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
      count: 10
    },
    {
      label: 'Google',
      count: 10
    },
    {
      label: 'rackspace',
      count: 1
    },
    {
      label: 'Random',
      count: 1
    },
    {
      label: 'small value',
      count: 4
    },
    {
      label: 'Big Value',
      count: 10
    },
    {
      label: 'Ten 1',
      count: 10
    },
    {
      label: 'Ten 2',
      count: 10
    },
    {
      label: 'Ten 3',
      count: 10
    },
    {
      label: 'Ten 4',
      count: 10
    },
    {
      label: 'Ten 5',
      count: 10
    },
    {
      label: 'Ten 6',
      count: 10
    },
  ];

  $interval(function() {
    $scope.pieData[0].count = Math.abs(Math.ceil(Math.random()*20) + 1);
    $scope.pieData[1].count = Math.abs(21 - $scope.pieData[0].count);
  }, 2000);

  //$interval(function() {
    //$scope.tmp = $scope.pieData.shift();
    //$timeout(function() {
      //$scope.pieData.unshift($scope.tmp);
    //}, 2000);
  //}, 4000);


  $scope.toggleParam = 'A';

  $scope.dateValues = {
    start: 1401984046467,
    end: null,
    period: 'custom',
    utc: false
  };

});
