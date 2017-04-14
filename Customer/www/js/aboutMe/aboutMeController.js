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
  .controller('billCtrl', function($scope,$state, $rootScope,aboutMeService,$filter) {

    //var today = new Date();
    //$scope.formatDate = $filter('date')(today, 'M');
    //alert($scope.formatDate);
    aboutMeService.billList(0).success(function (result) {
     console.log(result);
      $scope.yearAndMonthPaymentList=result.yearAndMonthPaymentList;
    })

    //全部账单
    $scope.all=function(typeId){
      aboutMeService.billList(typeId).success(function (result) {
        console.log(result);
        $scope.yearAndMonthPaymentList=result.yearAndMonthPaymentList;
      })
    }
//总消费账单
    $scope.zongConsume=function(typeId){
      aboutMeService.billList(typeId).success(function (result) {
        console.log(result);
        $scope.yearAndMonthPaymentList=result.yearAndMonthPaymentList;
      })
    }
    //总充值账单
    $scope.zongRecharge=function(typeId){
      aboutMeService.billList(typeId).success(function (result) {
        console.log(result);
        $scope.yearAndMonthPaymentList=result.yearAndMonthPaymentList;
      })
    }
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
  .controller('myInformationCtrl', function($scope,$state, $rootScope,aboutMeService,$ionicPopup) {
      //$scope.customerName='王坤';
      //$scope.phone='18772115070';
      $scope.address='虹桥银城大厦';

    aboutMeService.getUesrInfoService().success(function (result) {
      console.log(result);
      $scope.userName=result.userName
      $scope.teleNumber=result.teleNumber
      //$scope.billList=result.paymentList
    })
    //更改个人信息
    $scope.updateInformation=function(){
      aboutMeService.updateInformationService(
        $scope.userName,
        $scope.teleNumber
      ).success(function (result) {
        console.log(result);
        if(result.code=='200'){
          var alertPopup = $ionicPopup.alert({
            title: '温馨提示',
            template: '修改个人信息成功!!'
          });
          alertPopup.then(function (res) {
            //用户点击确认登录后跳转
            $state.go("tab.aboutMe");
          })
        }
      })
    }

  })
