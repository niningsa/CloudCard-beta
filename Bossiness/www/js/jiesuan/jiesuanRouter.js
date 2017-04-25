angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider
      //结算的首页
      .state('tab.jiesuanHome', {
        url: '/jiesuanHome',
        // cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/jiesuan/tab-jiesuanHome.html',
            controller: 'jiesuanHomeCtrl'
          }
        }
      })
      //具体结算的页面
      .state('tab.jiesuanDetail', {
        url: '/jiesuanDetail',
        // cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/jiesuan/tab-jiesuanDetail.html',
            controller: 'jiesuanDetailCtrl'
          }
        }
      })
      //结算方式的页面
      .state('tab.jiesuanMethod', {
        url: '/jiesuanMethod',
        // cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/jiesuan/tab-jiesuanMethod.html',
            controller: 'jiesuanMethodCtrl'
          }
        }
      })
  })
