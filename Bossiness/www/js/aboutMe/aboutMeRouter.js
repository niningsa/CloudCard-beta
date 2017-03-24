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
  })
