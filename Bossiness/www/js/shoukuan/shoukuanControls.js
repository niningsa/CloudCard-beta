angular.module('shoukuan.controllers', [])

  .controller('shoukuanHomeCtrl', function ($scope, $state, $ionicLoading, $timeout,shoukuanSellerService) {

  })

    //店家扫客户二维码来查询客户的卡
  .controller('scanShopReceivablesCtrl', function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicPopup, $ionicLoading, $timeout,applySellerService) {
    $scope.scanCustomerBarcode = function () {
      $ionicLoading.show({
        template: "正在调摄像头,请稍后...."
      });
      $timeout(function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $ionicLoading.hide();
          var cardCode = imageData.text;                                  // 扫到的数据
          //var cardCode="user_pay_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTIyMzc2MjYsImlzcyI6ImNsb3VkY2FyZCIsImRlbGVnYXRvck5hbWUiOiJkZWZhdWx0IiwidXNlciI6IjEwMDA4IiwiaWF0IjoxNDkyMjM3NjI2fQ.t4XXE3t2vZzfvpuixuwOnt_sI52aA8dMTsRDt3P-WYs"
          //var cardCode="56067041145085307052"
          //alert(cardCode+"客户二维码"+cardCode.substr(0,9));
          if (cardCode != '') {
            if((cardCode.substr(0,9))=="user_pay_"){
              //到选客户的卡来支付的页面
              $state.go("tab.shopCustomerCardList",{"qrcode":cardCode});
            }else{
              //直接到输入金额支付的页面
              $state.go("tab.xiaoFei",{"cardCode":cardCode});
            }
          }
        });
      }, 1000);
    };


  })

  //到客户卡的列表
  .controller('shopCustomerCardListCtrl', function ($scope, $state, $rootScope, $ionicPopup,$stateParams, $ionicLoading, $timeout,shoukuanSellerService) {
    $scope.qrcode=$stateParams.qrcode;
    shoukuanSellerService.selectCustomerCardList($scope.qrcode).success(function (data) {
      console.log(data);
      $scope.cloudCardList=data.cloudCardList;
    });

  })

  //b扫c消费收款
  .controller("xiaoFeiCtrl", function ($scope, $state, $rootScope, $ionicLoading, $timeout,$stateParams) {
    $scope.cardCode=$stateParams.cardCode;
    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");
    if (token == null) {
      $state.go("login");
    }

    $scope.pay = function (amount) {
      $scope.msg = '';
      var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,3})?$/;

      //金额必须大于0的数字..痛苦 0_o||
      if (!reg.test(amount)) {
        $scope.msg = '输入金额不合法，请重新输入！！';
        $("input[name='amount']").val("");
      } else {
        if (parseFloat(amount) <= 0) {
          $scope.msg = '输入金额不合法，请重新输入！！';
          $("input[name='amount']").val("");
        } else {
          $scope.msg = "";                                                //清空错误提示
          if ($scope.cardCode != '') {
            $.ajax({
              url: $rootScope.interfaceUrl + "cloudCardWithdraw",
              type: "POST",
              data: {
                "cardCode": $scope.cardCode,
                "token": token,
                "organizationPartyId": organizationPartyId,
                "amount": amount
              },
              success: function (result) {
                console.log(result);
                // alert(result.code+" "+result.msg+"　"+result.amount+" "+result.cardBalance);
                if (result.code == '200') {
                  $state.go("tab.returnMess", {
                    cardCode:  $scope.cardCode,
                    amount: amount,
                    cardBalance: result.cardBalance
                  });
                } else {
                  $scope.$apply(function () {
                    $scope.msg = result.msg;
                  });
                }
              }
            });

          }
        }
      }
    };

  })

  /*
   * Desc 无卡收款（使用手机号来消费）
   * Author LN
   * Date 2017-2-26
   * */
  .controller("noCardReceivablesCtrl", function ($scope,$ionicPopup,$state,$rootScope,$stateParams,applySellerService) {

    $scope.noCardReceivables=function(){
      //验证手机号是否合法
      var flag = true;
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if (!phoneReg.test( $scope.teleNumber)) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请输入正确的手机号码",
          okText: "确定",
        })
        flag = false;
      }
      if(flag){
        $state.go("tab.customerCard",{
          "teleNumber":$scope.teleNumber,
          "amount":$scope.amount});
      }
    }
  })

  /*
   * Desc 无卡收款（查询该客户的卡）
   * Author wk
   * Date 2017-2-26
   * */
  .controller("customerCardCtrl", function ($scope,$ionicPopup,$state,$rootScope,$stateParams,shoukuanSellerService) {
    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    var flag = true;
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (!phoneReg.test( $scope.teleNumber)) {
      $ionicPopup.alert({
        title: "温馨提示",
        template: "请输入正确的手机号码",
        okText: "确定",
      })
      flag = false;
    }
    if(flag){
      shoukuanSellerService.selectCustomerCard(
        $scope.teleNumber,
        $scope.amount
      ).success(function (data) {
        console.log(data.code);
        if(data.code=='500'){
          $ionicPopup.alert({
            title: "温馨提示",
            template: data.msg,
            okText: "确定",
          })
        }
        if(data.code=='200'){
          $scope.chatList=data.cloudCardList;
        }


      }).error(function (data) {

      });
    }

    //到验证码的页面
    $scope.yanZhenNodeView=function(cardId,cardCode){
      $state.go("tab.identifyingCode",{
        "cardId":cardId,
        "cardCode":cardCode,
        "teleNumber":$scope.teleNumber,
        "amount":$scope.amount});
    }
  })

  /*
   * Desc 传递验证码
   * Author wk
   * Date 2017-2-26
   * */
  .controller("identifyingCodeCtrl", function ($http,$interval,$ionicLoading,$scope,$state,$rootScope,$stateParams,$ionicLoading,$ionicPopup,shoukuanSellerService) {
    $scope.cardId = $stateParams.cardId;
    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.cardCode = $stateParams.cardCode;
    var token=$.cookie("token");
    //无卡收款获取手机验证码
    $scope.codeBtn = '获取验证码';
    $scope.getPayIdentifyCode = function (teleNumber) {
      $ionicPopup.confirm({
        title: "提示",
        template: "<p align='center' style='font-size: 12px'>验证码将发送到"+teleNumber+"</p>",
        cancelText: "取消",
        okText: "确定"
      }).then(function (res) {
        if(res){
          $scope.msg = "";//先清空错误提示
          if (teleNumber) {
            $http({
              method: "POST",
              url: $rootScope.interfaceUrl + "getPayCaptchaOfUser",
              data: {
                "token": token,
                "teleNumber": teleNumber,
                "amount": $scope.amount
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},         // 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
              transformRequest: function (obj) {                                      // 参数是对象的话，需要把参数转成序列化的形式
                var str = [];
                for (var p in obj) {
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
              }
            }).success(function (result) {
              if (result.code === '500') {
                $scope.$apply(function () {
                  $scope.msg = result.msg;
                });
              } else {
                //倒计时
                $scope.n = 60;
                $scope.codeBtn = "获取中 " + $scope.n + " 秒";
                var time = $interval(function () {
                  $scope.n--;
                  $scope.codeBtn = "获取中 " + $scope.n + " 秒";
                  if ($scope.n === 0) {
                    $interval.cancel(time); // 取消定时任务
                    $scope.codeBtn = '获取验证码';
                    $scope.codeBtnDisable = false;
                  }
                }, 1000);
                $scope.codeBtnDisable = true;
              }
            });
          } else {
            $scope.msg = "请输入您的手机号码！！";
          }
        }
      });
    };
    //无卡收款
    $scope.shouKuan=function(){
      //$("#sk").attr("disabled","disabled")
      $("#sk").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
      shoukuanSellerService.noCardShouKuan(
        $scope.teleNumber,
        $scope.cardId,
        $scope.cardCode,
        $scope.amount,
        $scope.identifyCode
      ).success(function (data) {
        console.log(data);
        if(data.code=="200"){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '收款成功',
            template: '恭喜您收款成功！'
          });
          alertPopup.then(function (res) {
            //用户点击确认登录后跳转
            $state.go("tab.returnMess",{
              "cardCode":data.cardCode,
              "amount":data.amount,
              "cardBalance":data.cardBalance
            });
          })
        }else{
          var alertPopup = $ionicPopup.alert({
            title: '验证码不正确',
            template: '验证码不正确！'
          });
        }
      }).error(function (data) {

      });
    }
  })
  /*
   * Desc 无卡收款（使用手机号来消费）
   * Author LN
   * Date 2017-2-26
   * */
  .controller("phoneNumberConsumeCtrl", function ($scope, $rootScope) {

  })
;




