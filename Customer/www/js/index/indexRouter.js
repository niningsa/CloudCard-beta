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
      //卡包
      .state('tab.myCard', {
        url: '/myCard/:chats',
        cache: false,
        views: {
          'tab-index': {
            templateUrl: 'templates/index/tab-myCard.html',
            controller: 'indexCtrl'
          }
        }
      });
  })
