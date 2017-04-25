angular.module('mycircle.controllers', [])

  .controller('circleListCtrl', function($scope, $ionicModal, $rootScope, mycircleServices) {

    /*
     * Desc 这里是查询附近圈子和店铺的列表
     * Author WK
     * Date 2017-3-13
     * */
    mycircleServices.myGroupList().success(function (result) {
      $scope.storeList=result.storeList;
      $scope.region =result.region;

      })
    //导航栏的查询
    $scope.searchStoreName=function(storeName){
      var area=$("#geo").html();
      mycircleServices.myGroupList(storeName,area).success(function (result) {
        $scope.storeList=result.storeList;
      })
    }


    //点击下拉列表出现更多的城市列表
    $ionicModal.fromTemplateUrl('templates/mycircle/cityModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      console.log(modal);
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
      $("ion-modal-view").removeClass("modal slide-in-up ng-enter active ng-enter-active");
      mycircleServices.myGroupList().success(function (result) {
        $scope.countyList=result.countyList;
        $scope.region =result.region;

      })
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };


  })
  //城市选择完成之后
  .controller('settleModalCtrl', function($scope,$state, $rootScope,mycircleServices,$stateParams) {

    $scope.choice=function(geoId,city){
      document.getElementById("adress").innerHTML=city;
      document.getElementById("geo").innerHTML=geoId;
      //$("#adress").html(city);
      $scope.modal.hide();
    }

    $scope.onOff = true;
    $scope.changeOnOff = function (onOff) {
      if (onOff == true) {
        $scope.onOff = false;
      } else {
        $scope.onOff = true;
      }
    };
  })
  /*
   * Desc 这里是查询附近圈子和店铺的列表
   * Author WK
   * Date 2017-3-13
   * */
  .controller('shopDetailsCtrl', function($scope,$state, $rootScope,mycircleServices,$stateParams) {
    $scope.storeId = $stateParams.storeId;
    mycircleServices.shopDetailByStoreId($scope.storeId).success(function (data) {
      console.log(data);
       $scope.storeName=data.storeName;
       $scope.storeAddress=data.storeAddress;
       $scope.storeImg=data.storeImg;
      $scope.ossUrl=data.ossUrl;
      $scope.storeInfoImgList=data.storeInfoImgList;
    })

    //查询客户是否拥有该店铺的卡，如果有卡就进行充值，没卡就买卡
    $scope.selectShopCard=function(storeId){
      $state.go("tab.selectShopCard", {
        "storeId": storeId
      });

    }
    //消费记录
    $scope.record=function(storeId){
      $state.go("tab.bill");
    }
    //图片的预览
    $scope.shouBigImage=function(){
      $state.go("showPicture",{"storeId":$scope.storeId});
    }

  })


  //图片预览
  .controller('showPictureCtrl', function ($scope,$ionicPopup,$state,$rootScope,mycircleServices,$stateParams) {
    $scope.storeId = $stateParams.storeId;
    mycircleServices.shopDetailByStoreId($scope.storeId).success(function (data) {
      $scope.ossUrl=data.ossUrl;
      $scope.storeInfoImgList=data.storeInfoImgList;
    })

  })


  /*
   * Desc 这里是查询附近圈子和店铺的列表
   * Author WK
   * Date 2017-4-7
   * */
  .controller('selectShopCardCtrl', function($scope,$state, $rootScope,mycircleServices,$stateParams) {
    $scope.storeId = $stateParams.storeId;
    //查询客户是否拥有该店铺的卡，如果有卡就进行充值，没卡就买卡
      mycircleServices.selectShopCard($scope.storeId).success(function (data) {
       console.log(data);
        $scope.cloudList= data.cloudCardList;
      })

    //跳到买卡的页面
    $scope.maiKa=function(storeId){
      $state.go("tab.maiKa", {
        "storeId": storeId
      });
    }
    //店铺卡充值
    $scope.chongzhi=function(storeId,cardId){
      $state.go("tab.chongzhi", {
        "storeId": storeId,
        "cardId": cardId
      });
    }

  })
  /*
   * Desc 进入到买卡支付的页面
   * Author WK
   * Date 2017-4-7
   * */
  .controller('maiKaCtrl', function($scope,$state, $rootScope,mycircleServices,$stateParams) {
    $scope.storeId = $stateParams.storeId;
    //查询客户是否拥有该店铺的卡，如果有卡就进行充值，没卡就买卡
    $scope.ret = {choice: '100'};
    $scope.alipay = function (choice, storeId) {
      $.ajax({
        url: $rootScope.interfaceUrl + "purchaseCard", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type: "POST",
        data: {
          "paymentType": "aliPay",
          "storeId": storeId,
          "paymentService": "buyCard",
          "subject": "库胖-充值",
          "totalFee": "0.01",
          "body": "充值"
        },
        success: function (result) {
          console.log(result.payInfo);
          //第二步：调用支付插件
          cordova.plugins.AliPay.pay(result.payInfo, function success(e) {
            // alert("成功了："+e.resultStatus+"-"+e.result+"-"+e.memo);
            //支付成功到扫一扫的卡页面列表
            $state.go("tab.selectShopCard", {
              "storeId": $scope.storeId
            });
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin = function (choice, storeId) {
      $.ajax({
        url: $rootScope.interfaceUrl + "purchaseCard", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type: "POST",
        data: {
          "paymentType": "wxPay",
          "storeId": storeId,
          "paymentService": "buyCard",
          "totalFee": "0.01",              // 微信金额不支持小数，这里1表示0.01
          "body": "库胖-充值",           // 标题不能使用中文
          "tradeType": "APP"
        },
        success: function (result) {
          console.log(result);
          //第二步：调用支付插件
          wxpay.payment(result, function success(e) {
            //alert("成功了：" + e);
            $state.go("tab.selectShopCard", {
              "storeId": $scope.storeId
            });
            //$state.go("myCircleCard",{"storeId":storeId});
          }, function error(e) {
            //alert("失败了：" + e);
          });
        }
      });

    };

  })
  /*
   * Desc 进入到店充值的页面
   * Author WK
   * Date 2017-4-7
   * */
  .controller('chongzhiCtrl', function ($scope, $stateParams, $rootScope,$state, $ionicLoading) {
    //页面信息初始化
    $scope.cardId = $stateParams.cardId;
    $scope.storeId = $stateParams.storeId;
    //单选按钮初始化
    $scope.ret = {choice: '100'};
    //这里的充值说的是给我的卡充值，不是圈子卡充值
    $scope.alipay=function (choice) {
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "aliPay",
          //"cardId": "213213123",
          "cardId": $scope.cardId,
          "paymentService": "recharge",
          "subject": "库胖-充值",
          "totalFee": "0.01",
          "body": "充值"
        },
        success: function(result){
          console.log(result.payInfo);

          //第二步：调用支付插件
          cordova.plugins.AliPay.pay(result.payInfo, function success(e){
            $state.go("tab.selectShopCard", {
              "storeId": $scope.storeId
            });
          }, function error(e){
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };
    //从我的卡页面进去的充值
    $scope.weiXin=function (choice) {
      //alert(choice);
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "wxPay",
          //"cardId": "213213123",
          "cardId": $scope.cardId,
          "paymentService": "recharge",
          //"totalFee": parseFloat(1) * 100,              // 微信金额不支持小数，这里1表示0.01
          "totalFee": "0.01",              // 微信金额不支持小数，这里1表示0.01
          "body": "库胖-充值",           // 标题不能使用中文
          "tradeType":"APP"
        },
        success: function(result){
          console.log(result);
          //第二步：调用支付插件
          wxpay.payment(result, function success (e) {
            $state.go("tab.selectShopCard", {
              "storeId": $scope.storeId
            });
          }, function error (e) {
            //alert("失败了："+e);
          });
        }
      });

    };

  })
