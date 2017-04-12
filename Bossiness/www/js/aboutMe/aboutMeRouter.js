angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider

      .state('tab.aboutMe', {
        url: '/aboutMe',
        cache: false,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-aboutMe.html',
            controller: 'aboutMeCtrl'
          }
        }
      })
      //我的店铺的具体信息
      .state('tab.myShopDetail', {
        url: '/myShopDetail',
        cache: false,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myShopDetail.html',
            controller: 'myShopDetailCtrl'
          }
        }
      })
  })
