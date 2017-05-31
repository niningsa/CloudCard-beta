angular.module('index.controllers', [])
  .controller('indexCtrl',function ($scope,$state, $rootScope, $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, indexService) {
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
            console.log(result);

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
    };
  })
