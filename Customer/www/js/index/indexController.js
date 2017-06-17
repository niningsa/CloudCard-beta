angular.module('index.controllers', [])
  .controller('indexCtrl',function ($scope,$state, $rootScope,  $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, indexService) {
    var token=$.cookie("token");
    if(token){
      //付款码
      $scope.paymentCode = function () {
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
      };

      $scope.scanBarcode = function () {
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
              }
            }, function (error) {
            });
          }, 1000);
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
      };
    }else{
      $state.go("login");
    }
  })

  .controller('ChatsCtrl', function($scope, Chats,$stateParams,$state, $rootScope, $ionicScrollDelegate) {
    $scope.chats = Chats.all();
    $scope.doRefresh = function() {
      $scope.chats = Chats.all();
      $scope.$broadcast("scroll.refreshComplete");
    };

    $scope.cardInfo = function (cardId,cardBalance,cardName,cardCode,isAuthToOthers,isAuthToMe) {
      $state.go("tab.chat-detail",{
        "cardId":cardId,
        "cardBalance":cardBalance,
        "cardName":cardName,
        "cardCode":cardCode,
        "isAuthToOthers":isAuthToOthers,
        "isAuthToMe":isAuthToMe
      });
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $state, $ionicPopup, $rootScope, $ionicModal) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;
    //  将客户的cardCode放入生成的二维码中
    jQuery('#output').qrcode($stateParams.cardCode);
    //根据是否授权来控制授权按钮的显示与否
    //if($stateParams.isAuthToOthers=='N' & $scope.isAuthToMe=='N'){
    //  //jQuery('#sq').html('你可以<a href="#/tab/cardinput/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'">授权</a>给你好友！');
    //  jQuery('#sq').html('你可以<a href="#/tab/accredit/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'">授权</a>给你好友！');
    //}else{
    //  jQuery('#sq').html('该卡已被授权,你可以<a href="#/tab/revokeCardAuth/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'/'+$stateParams.isAuthToOthers+'/'+$scope.isAuthToMe+'">解除授权</a>');
    //
    //}
    //绑定事件判断到底是应该解除授权还是授权
    if($stateParams.isAuthToOthers=='N' & $scope.isAuthToMe=='N'){
      $scope.shouQuan=true;
      $scope.jieChu=false;
      $scope.zhuanKa=true;

    }else if($stateParams.isAuthToOthers=='Y'){//卡主人可以解除授权
      $scope.shouQuan=false;
      $scope.jieChu=true;
    }else{
      $scope.shouQuan=false;
      $scope.jieChu=false;

    }
    //转卡的操作
    $scope.sellCard=function(cardId,cardBalance,cardName,cardCode,isAuthToOthers,isAuthToMe){
      window.location.href="#/tab/sellCard/"+cardId+"/"+cardBalance+"/"+cardName+"/"+cardCode+"/"+isAuthToOthers+"/"+isAuthToMe;
    }
    //卡授权
    $scope.sq=function(cardId,cardBalance,cardName,cardCode,isAuthToOthers,isAuthToMe){
      window.location.href="#/tab/accredit/"+cardId+"/"+cardBalance+"/"+cardName+"/"+cardCode+"/"+isAuthToOthers+"/"+isAuthToMe;
    };
    //卡解除授权
    $scope.jc=function(cardId,cardBalance,cardName,cardCode){
      var token=$.cookie("token");
      $.ajax({
        type: "POST",
        url: $rootScope.interfaceUrl+"revokeCardAuth",
        async: false,
        data: {
          "token":token,
          "cardId":$scope.cardId
          //"amount":$other_money,
          //"cardCode": $scope.cardCode,
          //"cardName": $scope.cardName,
        },
        dataFilter: function(data){
          console.log("raw data: "+data);
          var idx =  data.indexOf("//");
          if(data && /^\s*\/\/.*/.test(data) && idx>-1){
            data = data.substring(idx+2);
          }
          return data;
        },
        success: function(data){
          console.log(data);
          if(data.code==500){
            $ionicPopup.alert({
              title:"温馨提示",
              template:data.msg,
              okText:"确定",

            })
          }
          //跳转到登录的页面
          if(data.code==400){
            $state.go("login");
          }
          if(data.code==200){

            $ionicPopup.alert({
              title:"温馨提示",
              template:"解卡成功",
              okText:"确定",
            })
              .then(function(res){
                if(res){
                  $state.go("tab.chats");
                }
              })
            //授权成功，传入必要的参数，跳转到授权成功的查看页面
            //window.location.href="#/tab/chats/"+$scope.cardId+"/"+$scope.cardBalance+"/"+$scope.cardName+"/"+$scope.cardCode+"/"+ $scope.isAuthToOthers+"/"+$scope.isAuthToMe;
          }
        },
        error:function (e) {
          console.log(e);
        }
      });
    };
  })
