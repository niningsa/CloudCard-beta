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
        url: '/shopDetails',
        cache: false,
        views: {
          'tab-circleList': {
            templateUrl: 'templates/mycircle/tab-shopDetails.html',
            controller: 'shopDetailsCtrl'
          }
        }
      });
  })
