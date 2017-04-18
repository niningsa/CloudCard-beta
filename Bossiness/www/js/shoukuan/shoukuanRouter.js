angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider
    //收款首页
      .state('tab.shoukuanHome', {
        url: '/shoukuanHome',
        cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/shoukuan/tab-shoukuanHome.html',
            controller: 'shoukuanHomeCtrl'
          }
        }
      })
    //通过扫客户二维码
      .state('tab.shopCustomerCardList', {
        url: '/shopCustomerCardList/:qrcode',
        cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/shoukuan/tab-shopCustomerCardList.html',
            controller: 'shopCustomerCardListCtrl'
          }
        }
      })

      //选客户的卡来收款
      .state('tab.xiaoFei', {
        url: '/xiaoFei/:cardCode',
        cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-xiaofe.html',
            controller: 'xiaoFeiCtrl'
          }
        }
      })
      //无卡消费,通过电话号码和金额查询客户的卡
      .state('tab.customerCard', {
        url: '/customerCard/:teleNumber/:amount',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/shoukuan/tab-customerCard.html',
            controller: 'customerCardCtrl'
          }
        }
      })
      //到验证码的确认页面
      .state('tab.identifyingCode', {
        url: '/identifyingCode/:cardId/:cardCode/:teleNumber/:amount',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/shoukuan/tab-identifyingCode.html',
            controller: 'identifyingCodeCtrl'
          }
        }
      })

      //无卡消费
      .state('tab.phoneNumberConsume', {
        url: '/phoneNumberConsume',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/shoukuan/tab-phoneNumberConsume.html',
            controller: 'phoneNumberConsumeCtrl'
          }
        }
      })

  })
