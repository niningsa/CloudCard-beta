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
    var viewSize=20;//账单一开始默认加载20条数据

    aboutMeService.billList().success(function (result) {
     console.log(result);
      $scope.billList=result.paymentList
    })
  })
  /*
   * Desc 我的客服
   * Author WK
   * Date 2017-3-30
   * */
  .controller('customerServiceCtrl', function($scope,$state, $rootScope,aboutMeService) {


  })
  /*
   * Desc 我的信息
   * Author WK
   * Date 2017-3-30
   * */
  .controller('myInformationCtrl', function($scope,$state, $rootScope,aboutMeService) {
      $scope.customerName='王坤';
      $scope.phone='18772115070';
      $scope.address='虹桥银城大厦';

  })
