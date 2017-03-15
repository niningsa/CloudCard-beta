angular.module('starter')
  .config(function ($stateProvider) {
    $stateProvider
    //关于我
      .state('tab.circleList', {
        url: '/circleList',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-cicleList.html',
            controller: 'circleListCtrl'
          }
        }
      });
  })
