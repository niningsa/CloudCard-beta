angular.module('chongzhi.controllers', [])
  .controller('chongzhiHomeCtrl', function ($scope, $state, $ionicLoading, $timeout,shoukuanSellerService) {

  })

  /*
   * Desc 无卡充值（使用手机号来充值）
   * Author LN
   * Date 2017-4-10
   * */
  .controller("phoneNumberRecordCtrl", function ($scope,$ionicPopup,$state,$rootScope,$stateParams,chongzhiService) {
    $scope.noCardRecharge=function(){
      $("#cz").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
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
        chongzhiService.teleNumberRecharge(
          $scope.teleNumber,
          $scope.amount
        ).success(function (data) {
          console.log(data);
          if(data.code=='500'){
            $ionicPopup.alert({
              title: "温馨提示",
              template: "用户不存在!!",
              okText: "确定",
            })
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
    }

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
  })

