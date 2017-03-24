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
      });
  })
