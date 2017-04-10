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
      })
      //
      /*
       * Desc 从列表进入到具体的店铺
       * Author WK
       * Date 2017-3-27
       * */
      .state('tab.shopDetails', {
        url: '/shopDetails/:storeId',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-shopDetails.html',
            controller: 'shopDetailsCtrl'
          }
        }
      })
      /*
       * Desc 查询客户在这家店可用卡的列表
       * Author WK
       * Date 2017-4-7
       * */
      .state('tab.selectShopCard', {
        url: '/selectShopCard/:storeId',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-shopCardList.html',
            controller: 'selectShopCardCtrl'
          }
        }
      })
      /*
       * Desc 进入到买卡的页面
       * Author WK
       * Date 2017-4-7
       * */
      .state('tab.maiKa', {
        url: '/maiKa/:storeId',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-buyCardPay.html',
            controller: 'maiKaCtrl'
          }
        }
      })
      /*
       * Desc 进入到卡充值的页面
       * Author WK
       * Date 2017-4-7
       * */
      .state('tab.chongzhi', {
        url: '/chongzhi/:storeId/:cardId',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-shopRecharge.html',
            controller: 'chongzhiCtrl'
          }
        }
      })

  })
