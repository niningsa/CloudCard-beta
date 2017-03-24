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

//账户与安全设置
  .controller('accountSecurityCtrl', function($scope,$state, $rootScope,aboutMeService) {
    /*
     * Desc 这里是设置账户与安全的页面
     * Author WK
     * Date 2017-3-21
     * */
  })


  /*
   * Desc 我的钱包的页面查询
   * Author WK
   * Date 2017-3-21
   * */
  .controller('myWalletCtrl', function($scope,$state, $rootScope,aboutMeService) {

  })
  /*
   * Desc 账单页面
   * Author WK
   * Date 2017-3-21
   * */
  .controller('billCtrl', function($scope,$state, $rootScope,aboutMeService) {

  })
