angular.module('starter')
  .config(function ($stateProvider) {
    $stateProvider
      //首页
      .state('tab.index', {
        url: '/index',
        cache: false,
        views: {
          'tab-index': {
            templateUrl: 'templates/index/tab-index.html',
            controller: 'indexCtrl'
          }
        }
      })
  })
