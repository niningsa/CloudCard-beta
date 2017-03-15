angular.module('aboutMe.controllers', [])

  .controller('aboutMeCtrl', function($scope,$state, $rootScope,aboutMeService) {


    /*
     * Desc 这里是查询积分和会员的等级
     * Author WK
     * Date 2017-3-13
     * */
    aboutMeService.bizMyGroup().success(function (data) {
      var token = $.cookie("token");
      if(token){
        $scope.score=data.score;
        $scope.userLevel=data.userLevel;
      }else{
        $scope.score=0;
        $scope.userLevel="大众会员";
      }

    })


  })
