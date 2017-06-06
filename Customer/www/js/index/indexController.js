angular.module('index.controllers', [])
  .controller('indexCtrl',function ($scope,$state, $rootScope,  $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, indexService) {
    var token=$.cookie("token");
    //付款码
    $scope.paymentCode = function () {
      if (token) {
        $.ajax({
          url: $rootScope.interfaceUrl + "getPaymentQRCode",
          type: "POST",
          data: {
            "token": token
          },
          success: function (result) {
            if (result.code == '200') {
              $scope.$apply(function () {
                $scope.msg = "";
              });

              $state.go("tab.paymentCode",
                {
                  "qrCode": result.qrCode,
                  "refreshTime": result.refreshTime
                });
            } else {
              $scope.$apply(function () {
                $scope.msg = result.msg;
              });
            }
          }
        });
      } else {
        $state.go("login");
      }
    };

    $scope.scanBarcode = function () {
      if(token){
        $ionicLoading.show({
          template: "正在调摄像头,请稍后...."
        });
        $timeout(function () {
          $cordovaBarcodeScanner.scan().then(function (imageData) {
            $ionicLoading.hide();
            $scope.msg = "";
            var qrCode = imageData.text;
            //扫到的数据
            if (qrCode != '') {
              //通过storeid来查询该圈子的卡，如果有卡就选卡来消费，如果没有卡就添加卡
              if(token){
                $.ajax({
                  url: $rootScope.interfaceUrl + "userScanCodeGetCardAndStoreInfo",
                  type: "POST",
                  data: {
                    "token": token,
                    "qrCode": qrCode
                  },
                  success: function (result) {
                    console.log(result);
                    if (result.code == '200') {
                      $scope.$apply(function () {
                        $scope.msg = "";
                      });
                      //跳到选卡的页面
                      $state.go("tab.chooseCard",
                        {
                          "storeId": result.storeId,
                          "storeName": result.storeName,
                          "qrCode": qrCode,
                          "canBuyGroupCard":result.canBuyGroupCard,//是否有圈子卡
                          "canBuyStoreCard":result.canBuyStoreCard,//是否有店的卡
                          "groupOwnerId":result.groupOwnerId,//圈子的id
                          "cloudCardList": JSON.stringify(result.cloudCardList)
                        });
                    } else {
                      $scope.$apply(function () {
                        $scope.msg = result.msg;
                      });
                    }
                  }
                });
              }else{
                $state.go("login");
              }
            }
          }, function (error) {
          });
        }, 1000);
      }else{
        $state.go("login");
      }

    }

    $scope.myCard = function() {
      $state.go("tab.chats");
    }

    //下拉刷新的操作
    $scope.doRefresh = function () {
      //下拉刷新的时候选中全部
      $.ajax({
        url: $rootScope.interfaceUrl + "myCloudCards",
        type: "POST",
        data: {
          "token": token,
          "storeId": $scope.storeId
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            $scope.chats = result.cloudCardList;

          } else {
            $scope.$apply(function () {
              $scope.msg = result.msg;
            });
          }
        }
      });
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");
    };;

  })

  .controller('ChatsCtrl', function($scope, Chats,$state, $rootScope, $ionicScrollDelegate) {
    $scope.chats = Chats.all();
    $scope.doRefresh = function() {
      $scope.chats = Chats.all();
      $scope.$broadcast("scroll.refreshComplete");
    };

  })
