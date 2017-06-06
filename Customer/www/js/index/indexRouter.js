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

      //我的卡页面查询列表
      .state('tab.chats', {
        url: '/index',
        views: {
          'tab-index': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        },
        cache:false,
        params:{
          isCache:true
        }
      });
  })
