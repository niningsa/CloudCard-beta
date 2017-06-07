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

      //从卡中将卡Id和金额传进去
      .state('tab.chat-detail', {
        url: '/chats/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
        cache: false,
        views: {
          'tab-index': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
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
