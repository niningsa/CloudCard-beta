angular.module('starter')

  .config(function ($stateProvider) {
    $stateProvider
    //关于我
      .state('tab.aboutMe', {
        url: '/aboutMe',
        cache: false,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myaccount.html',
            controller: 'aboutMeCtrl'
          }
        }
      })
      //账户与安全设置
      .state('tab.accountSecurity', {
        url: '/accountSecurity',
        cache: false,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-accountSecurity.html',
            controller: 'accountSecurityCtrl'
          }
        }
      })
      /*
       * Desc 我的钱包页面展示
       * Author WK
       * Date 2017-3-21
       * */
      .state('tab.myWallet', {
        url: '/myWallet',
        cache: false,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myWallet.html',
            controller: 'myWalletCtrl'
          }
        }
      })
      /*
       * Desc 账单的总页面
       * Author WK
       * Date 2017-3-21
       * */
      .state('tab.bill', {
        url: '/bill',
        cache: true,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-bill.html',
            controller: 'billCtrl'
          }
        }
      })
      /*
       * Desc 我的客服
       * Author WK
       * Date 2017-3-30
       * */
      .state('tab.customerService', {
        url: '/customerService',
        cache: true,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-customerService.html',
            controller: 'customerServiceCtrl'
          }
        }
      })
      /*
       * Desc 关于我们
       * Author WK
       * Date 2017-5-27
       * */
      .state('tab.aboutUs', {
        url: '/aboutUs',
        cache: true,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-aboutUs.html',
            controller: 'aboutUsServiceCtrl'
          }
        }
      })
      /*
       * Desc 关于库胖
       * Author WK
       * Date 2017-5-27
       * */
      .state('tab.aboutCloudCard', {
        url: '/aboutCloudCard',
        cache: true,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-aboutCloudCard.html',
            controller: 'aboutCloudCardServiceCtrl'
          }
        }
      })
      /*
       * Desc 我的信息
       * Author WK
       * Date 2017-3-30
       * */
      .state('tab.myInformation', {
        url: '/myInformation',
        cache: true,
        views: {
          'tab-aboutMe': {
            templateUrl: 'templates/aboutMe/tab-myInformation.html',
            controller: 'myInformationCtrl'
          }
        }
      });
  })
