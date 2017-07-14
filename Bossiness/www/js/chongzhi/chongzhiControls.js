angular.module('chongzhi.controllers', [])
  .controller('chongzhiHomeCtrl', function ($scope, $state, $ionicLoading, $timeout,shoukuanSellerService) {

  })

  /*
   * Desc 无卡充值（使用手机号来充值）
   * Author LN
   * Date 2017-4-10
   * */
  .controller("phoneNumberRecordCtrl", function ($http,$interval,$scope,$ionicPopup,$state,$rootScope,$stateParams,chongzhiService) {
    var token = $.cookie("token");
    $scope.noCardRecharge=function(){
      $("#cz").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
      //验证手机号是否合法
      var flag = true;
      var phoneReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (!phoneReg.test( $scope.teleNumber)) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请输入正确的手机号码",
          okText: "确定",
        })
        flag = false;
      }
      if(flag){
        chongzhiService.teleNumberRecharge(
          $scope.teleNumber,
          $scope.amount,
          $scope.captcha
        ).success(function (data) {
          if(data.code==='500'){
            $ionicPopup.alert({
              title: "温馨提示",
              template: data.msg,
              okText: "确定",
            });
          }
          if(data.code=='200'){
            $state.go("tab.returnChongZhiMess",{
              "cardCode":$scope.teleNumber,
              "cardName":data.cardName,
              "money":data.amount,
              "amount":data.cardBalance
            });
          }
        }).error(function (data) {

        });
      }
    };

    //无卡开卡获取手机验证码
    $scope.codeBtn = '获取验证码';
    $scope.getRechargeIdentifyCode = function (teleNumber) {
      $ionicPopup.confirm({
        title: "提示",
        template: "<p align='center' style='font-size: 12px'>验证码将发送到"+$scope.teleNumber+"</p>",
        cancelText: "取消",
        okText: "确定"
      }).then(function (res) {
        if(res) {
          $scope.msg = "";//先清空错误提示
          $scope.codeBtnDisable = false;//防止二次点击
          if ($scope.teleNumber) {
            $http({
              method: "POST",
              url: $rootScope.interfaceUrl + "getRechargeCaptchaOfUser",
              data: {
                "token": token,
                "teleNumber": $scope.teleNumber,
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
                $scope.codeBtn = '获取验证码';
                $scope.codeBtnDisable = true;//失败后可以立即获取验证码

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
  })


  /*
   * Desc 扫二维码得到卡ID到数据查判断是开卡还是充值
   * Author LN
   * Date 2016-11-19
   * */
  .controller("RechargeExampleController", function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicPopup, $ionicLoading, $timeout) {
    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");

    if (token == null) {
      $state.go("login");
    }

    $scope.scanBarcode = function () {
      $ionicLoading.show({
        template: "正在调摄像头,请稍后...."
      });

      $timeout(function () {

        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $ionicLoading.hide();
          var cardCode = imageData.text;                                  // 扫到的数据

          // alert(cardCode+" "+token+" "+organizationPartyId);

          if (cardCode != '') {
            $.ajax({
              url: $rootScope.interfaceUrl + "getCardInfoByCode",
              type: "POST",
              data: {
                "cardCode": cardCode,
                "token": token,
                "organizationPartyId": organizationPartyId
              },
              success: function (result) {
                // alert(result.code+" "+result.msg+" "+result.token);
                // alert(result.isActivated+" "+result.cardName+" "+result.cardId+" "+result.cardBalance);

                if (result.code == '200') {
                  if (result.isActivated == 'Y') {                        //已激活，那就到充值页面
                    $state.go("tab.recharge", {
                      cardCode: cardCode,
                      cardName: result.cardName,
                      cardBalance: result.cardBalance,
                      cardImg: result.cardImg
                    });
                  } else {                                                //到开卡页面
                    // alert(result.cardCode);
                    $state.go("tab.activate", {
                      cardCode: cardCode,
                      cardName: result.cardName,
                      cardBalance: result.cardBalance,
                      cardImg: result.cardImg
                    });
                  }
                } else {
                  $ionicPopup.alert({
                    title: '温馨提示',
                    template: result.msg
                  });
                }
              }
            });
          }
        });

      }, 1000);
    };
  });

