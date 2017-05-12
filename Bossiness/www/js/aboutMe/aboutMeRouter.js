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

        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myShopDetail.html',
            controller: 'myShopDetailCtrl'
          }
        },
        cache:false,
        params:{
          isCache:true
        }
      })
      //店家的图片预览
      .state('showPicture', {
        url: '/showPicture',
        templateUrl: 'templates/aboutMe/showPicture.html',
        controller: 'showPictureCtrl'
      })

      //已经结算的历史消息
      .state('tab.jiesuanMessage', {
        url: '/jiesuanMessage',
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-jiesuanMessage.html',
            controller: 'jiesuanMessageCtrl'
          }
        },
        cache:false,
        params:{
          isCache:true
        }
      })
      //我的信用查询
      .state('tab.myCredit', {
        url: '/myCredit',
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myCredit.html',
            controller: 'myCreditCtrl'
          }
        },
        cache:false,
        params:{
          isCache:true
        }
      })


  })
