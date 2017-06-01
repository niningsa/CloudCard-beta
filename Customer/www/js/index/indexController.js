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
      $ionicLoading.show({
        template: "正在调摄像头,请稍后...."
      });
      $timeout(function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $ionicLoading.hide();
          $scope.msg = "";
          var cardCode = imageData.text;                                  // 扫到的数据
          if (cardCode != '') {
            $.ajax({
              url: $rootScope.interfaceUrl + "getStoreInfoByQRcode",
              type: "POST",
              data: {
                "token": token,
                "qrCode": cardCode
              },
              success: function (result) {
                //alert(result.msg+" "+result.storeName+" "+result.storeId+" "+result.storeImgUrl);
                if (result.code == '200') {
                  $state.go("tab.payment", {
                    qrCode: cardCode,
                    storeName: result.storeName,
                    storeId: result.storeId,
                    storeImgUrl: result.storeImgUrl,
                    cardId: $scope.cardId,
                    chooseCardStatus: 'N'
                  });
                } else {
                  $ionicPopup.alert({
                    title: '温馨提示',
                    template: result.msg
                  });
                }
              }
            });
          }
        }, function (error) {
          console.log("An error happened -> " + error);
        });
      }, 1000);
    }

    $scope.myCard = function() {
      var chats = [];
      var token=$.cookie("token");
      if(token){
        $.ajax({
          type: "POST",
          url:$rootScope.interfaceUrl+"myCloudCards",
          async: false,
          data: {
            "token": token,
            "viewIndex": 0,
            "viewSize": 200
          },
          // dataType: "json",
          dataFilter: function(data){
            console.log("raw data: "+data);
            var idx =  data.indexOf("//");
            if(data && /^\s*\/\/.*/.test(data) && idx>-1){
              data = data.substring(idx+2);
            }
            return data;
          },
          success: function(data){
            if (data.code == '200') {
              $scope.chats = data.cloudCardList;
              $state.go("tab.myCard", {
                chats: $scope.chats
              });
            } else {
              $scope.$apply(function () {
                $scope.msg = data.msg;
              });
            }
          },
          error:function (e) {
            $ionicPopup.alert({
              title:"温馨提示",
              template:"手机网络已中断，请尝试开启网络!!",
              okText:"确定",
            })
          }
        });
      }else{
        $state.go("login");
      }
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
