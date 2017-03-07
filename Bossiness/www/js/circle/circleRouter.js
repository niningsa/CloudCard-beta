angular.module('starter')

.config(function ($stateProvider) {
  $stateProvider

  /************************ Start 圈子 *********************************/

    .state('tab.myCircle', {
      url: '/myCircle',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/myCircle.html',
          controller: 'myCircleCtrl'
        }
      }
    })

    .state('tab.circleInvitation', {
      url: '/circleInvitation',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/circleInvitation.html',
          controller: 'circleInvitationCtrl'
        }
      }
    })


    .state('tab.circleInfo', {
      url: '/circleInfo',
      params:{
        'storeId':null,
        'isGroupOwner':null
      },
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/circleInfo.html',
          controller: 'circleInfoCtrl'
        }
      }
    })

    .state('tab.settleLayout', {
      url: '/settleLayout',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/settleLayout.html',
          controller: 'settleLayoutCtrl'
        }
      }
    })

    .state('tab.circeAccount', {
      url: '/circeAccount',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/account.html',
          controller: 'circeAccountCtrl'
        }
      }
    })

    .state('tab.createCircle', {
      url: '/createCircle',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/createCircle.html',
          controller: 'createCircleCtrl'
        }
      }
    })

    .state('tab.createCircleSuccess', {
      url: '/createCircleSuccess',
      cache: false,
      views: {
        'tab-myCircle': {
          templateUrl: 'templates/circle/createCircleSuccess.html'
        }
      }
    })


  /************************ End 圈子 *********************************/

});
