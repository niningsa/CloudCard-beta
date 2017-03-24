angular.module('starter', ['ionic', 'starter.controllers', 'circle.controllers', 'starter.services',
               'circle.services','aboutMe.controllers','aboutMe.services','bill.controllers','bill.services','ngCordova'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {

    // $rootScope.interfaceUrl="https://kayunka.weibeitech.com/cloudcard/control/";   //全局： 以后正式服务器接口 URL
    // $rootScope.interfaceUrl="http://121.40.214.81:8080/cloudcard/control/";        //全局： 服务器接口 URL
    $rootScope.interfaceUrl="http://139.196.112.121:8080/cloudcard/control/";      //全局： 测试接口 URL

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.views.swipeBackEnabled(false); // 防止ios左滑出现白屏

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.dash', {  //继承tab
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.receivables', {
    url: '/receivables',
    // cache: false,  //清除缓存
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-xiaofe.html',
        controller: 'DashCtrl'
      }
    }
  })


  .state('tab.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-aboutMe': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.recharge', {
    url: '/recharge/:cardCode/:cardName/:cardImg/:cardBalance',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-recharge.html',
        controller: 'RechargeCtrl'
      }
    }
  })

  .state('tab.activate', {
      url: '/activate/:cardCode/:cardName/:cardImg/:cardBalance',
      cache: false,
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-activate.html',
          controller: 'ActivateCtrl'
        }
      }
  })

  .state('tab.kaika', {
      url: '/kaika/:cardCode/:cardName/:money/:kaInputPhone',
      cache: false,
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-returnkaikaMess.html',
          controller: 'kaikaCtrl'
        }
      }
  })

  .state('tab.returnMess', {
      url: '/returnMess/:cardCode/:amount/:cardBalance',
      cache: false,
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-returnMess.html',
          controller: 'returnMessCtrl'
        }
      }
  })

  .state('tab.returnChongZhiMess', {
      url: '/returnChongZhiMess/:cardCode/:cardName/:money/:amount',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-returnChongZhiMess.html',
          controller: 'returnChongZhiMessCtrl'
        }
      }
  })

  .state('login', {
       url: '/login',
       params:{tel: null},
       cache: false,
       templateUrl: "templates/login.html",
       controller:'loginCtrl'
  })

  .state('setting', {
       url: '/setting',
       cache: false,
       templateUrl: 'templates/tab-setting.html',
       controller: 'settingCtrl'
  })

  .state('applySeller', {
       url: '/applySeller',
       cache: true,
       templateUrl: 'templates/applySeller.html',
       controller: 'applySellerCtrl'
  })


  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
