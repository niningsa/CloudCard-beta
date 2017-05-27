angular.module('aboutMe.controllers', [])

  .controller('aboutMeCtrl', function($scope,$state, $rootScope,aboutMeService) {


    /*
     * Desc 这里是查询积分和会员的等级
     * Author WK
     * Date 2017-3-13
     * */
    var token=$.cookie("token");
 if(token==null){
   $state.go("login");
 }
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

    $scope.address='虹桥银城大厦';

    aboutMeService.getUesrInfoService().success(function (result) {
      console.log(result);
      $scope.userName=result.userName
      $scope.teleNumber=result.teleNumber
      $scope.avaterUrl=result.avaterUrl
      $scope.contentId=result.contentId
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

    var token=$.cookie("token");
    if(token==null){
      $state.go("login");
    }
    aboutMeService.billList(0).success(function (data) {
     console.log(data);
      //$scope.yearAndMonthPaymentList=result.yearAndMonthPaymentList;
      $scope.paymentsList=data.paymentsList;
      function getTransDateYearMonth(obj){
        var transDate = parseInt(obj.transDate);
        var date = new Date(transDate);
        return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
      }
      $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      console.log( $scope.list);
    })

    //全部账单
    $scope.all=function(typeId){
      aboutMeService.billList(typeId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
        console.log( $scope.list);
      })
    }
//总消费账单
    $scope.zongConsume=function(typeId){
      aboutMeService.billList(typeId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
        console.log( $scope.list);
      })
    }
    //总充值账单
    $scope.zongRecharge=function(typeId){
      aboutMeService.billList(typeId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
        console.log( $scope.list);
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
   * Desc 关于我们
   * Author WK
   * Date 2017-5-27
   * */
  .controller('aboutUsServiceCtrl', function($scope,$state, $rootScope,aboutMeService) {


  })
  /*
   * Desc 关于库胖
   * Author WK
   * Date 2017-5-27
   * */
  .controller('aboutCloudCardServiceCtrl', function($scope,$state, $rootScope,aboutMeService) {


  })

  /*
   * Desc 我的信息
   * Author WK
   * Date 2017-3-30
   * */
  .controller('myInformationCtrl', function($scope,$state, $rootScope,aboutMeService,$ionicPopup,$cordovaImagePicker,$cordovaFileTransfer) {
      //$scope.customerName='王坤';
      //$scope.phone='18772115070';
      $scope.address='虹桥银城大厦';

    aboutMeService.getUesrInfoService().success(function (result) {
      console.log(result);
      $scope.userName=result.userName
      $scope.teleNumber=result.teleNumber
      $scope.avaterUrl=result.avaterUrl
      $scope.contentId=result.contentId
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

    $scope.selectPhoto = function () {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 100
      };
      //通过插件的方式进行上传图片
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $scope.imageSrcList = results;
          for (var i = 0; i < results.length; i++) {
            document.addEventListener('deviceready', function () {
              var url = $rootScope.interfaceUrl+"userUploadAvatar";
              var options = {
                fileKey:"uploadedFile"};
              $cordovaFileTransfer.upload(url, results[i], options)
                .then(function (result) {
                  //alert("success");
                }, function (err) {
                  //alert("fail");
                }, function (progress) {
                  // constant progress updates
                });
            }, false);
          }
          var alertPopup = $ionicPopup.alert({
            title: '成功',
            template: "图片上传成功"
          });
        }, function (error) {
          // error getting photos
        });
    };

  })
