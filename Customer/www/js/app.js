angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {

    $rootScope.interfaceUrl="http://121.40.214.81:8080/cloudcard/control/"; //接口前一截一样的

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
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
//我的卡页面查询列表
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      },
    cache:false,
      params:{
      isCache:true
    }
    })

    //从卡中将卡Id和金额传进去
    .state('tab.chat-detail', {
      url: '/chats/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

   //到卡授权的其他页面
  .state('tab.cardinput', {
      url: '/cardinput/:cardId/:cardBalance/:cardName/:cardCode',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-cardinput.html',
          controller: 'inputCtrl'
        }
      }
    })


    //授权的默认界面
  .state('tab.accredit', {
      url: '/accredit/:cardId/:cardBalance/:cardName/:cardCode',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-accredit.html',
          controller: 'inputAccreditCtrl'
        }
      }
    })
//用户授权成功的页面
  .state('tab.cardreturn', {
      url: '/cardreturn/:teleNumber/:amount/:fromDate/:thruDate/:cardName',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-getpower.html',
          controller: 'DashCtrl'
        }
      }
    })
    //默认方式授权成功的页面
  .state('tab.cardreturnsuccess', {
      url: '/cardreturnsuccess/:teleNumber/:amount/:day/:cardName',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-accreditSuccess.html',
          controller: 'DashAccreditCtrl'
        }
      }
    })
//账单的查询列表
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'CardDetailCtrl'
      }
    },
      cache:false,
      params:{
        isCache:true
      }
  })

//设置的页面，退出登录
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
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: "templates/login.html",
    controller:'LoginCtrl'
  });








  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
