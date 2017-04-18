angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider
      .state('tab.chongzhiHome', {  //继承tab
        url: '/chongzhiHome',
        views: {
          'tab-dash': {
            templateUrl: 'templates/chongzhi/tab-chongzhiHome.html',
            controller: 'chongzhiHomeCtrl'
          }
        }
      })


      //无卡充值
      .state('tab.phoneNumberRecord', {
        url: '/phoneNumberRecord',
        cache: false,
        views: {
          'tab-dash': {
            templateUrl: 'templates/chongzhi/tab-phoneNumberRecord.html',
            controller: 'phoneNumberRecordCtrl'
          }
        }
      })
  })
