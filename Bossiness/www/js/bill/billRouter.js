angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider

      .state('tab.billHome', {
        url: '/billHome',
        cache: false,
        views: {
          'tab-billHome': {
            templateUrl: 'templates/bill/tab-billHome.html',
            controller: 'billHomeCtrl'
          }
        }
      })
      //店内消费
      .state('tab.shopConsume', {
        url: '/shopConsume',
        cache: false,
        views: {
          'tab-billHome': {
            templateUrl: 'templates/bill/tab-shopConsume.html',
            controller: 'shopConsumeCtrl'
          }
        }
      })
      //卡内消费
      .state('tab.cardConsume', {
        url: '/cardConsume',
        cache: false,
        views: {
          'tab-billHome': {
            templateUrl: 'templates/bill/tab-cardConsume.html',
            controller: 'cardConsumeCtrl'
          }
        }
      })
      //其他消费
      .state('tab.otherConsume', {
        url: '/otherConsume',
        cache: false,
        views: {
          'tab-billHome': {
            templateUrl: 'templates/bill/tab-otherConsume.html',
            controller: 'otherConsumeCtrl'
          }
        }
      })
  })
