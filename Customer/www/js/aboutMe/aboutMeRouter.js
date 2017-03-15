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
      });
  })
