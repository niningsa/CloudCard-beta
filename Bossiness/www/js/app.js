// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {


    $rootScope.interfaceUrl="https://kayunka.weibeitech.com/cloudcard/control/";   //全局： 以后正式服务器接口 URL
    // $rootScope.interfaceUrl="http://121.40.214.81:8080/cloudcard/control/";        //全局： 服务器接口 URL
    // $rootScope.interfaceUrl="http://139.196.112.121:8080/cloudcard/control/";      //全局： 测试接口 URL

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
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

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
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
    cache: false,  //清除缓存
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
      'tab-account': {
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
       cache: false,
       templateUrl: "templates/login.html",
       controller:'loginCtrl'
  })

  .state('tab.setting', {
       url: '/setting',
       cache: false,
       views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'settingCtrl'
          }
       }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
