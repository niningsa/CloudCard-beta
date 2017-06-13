angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider
      .state('tab.kaikaHome', {
        url: '/kaikaHome',
        // cache: false,  //清除缓存
        views: {
          'tab-dash': {
            templateUrl: 'templates/kaika/tab-kaikaHome.html',
            controller: 'kaikaHomeCtrl'
          }
        }
      })
      //无卡开卡
      .state('tab.phoneNumberActivate', {
        url: '/phoneNumberActivate',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/kaika/tab-phoneNumberActivate.html',
            controller: 'phoneNumberActivateCtrl'
          }
        }
      })

      //已开卡的列表
      .state('tab.activateCardList', {
        url: '/activateCardList',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/kaika/tab-activateCardList.html',
            controller: 'activateCardListCtrl'
          }
        }
      })

      //已开卡的列表
      .state('tab.activateCardBill', {
        url: '/activateCardBill/:cardNumber/:ownerPartyId/:cardId',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/kaika/tab-activateCardBillList.html',
            controller: 'activateCardBillCtrl'
          }
        }
      })
  })
