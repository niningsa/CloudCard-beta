angular.module('starter.controllers', [])
  //调用手机通讯录
  .controller('TodoCtrl', function ($scope, $ionicModal, $cordovaContacts) {
    $scope.pickContactss = function () {
      $cordovaContacts.pickContact().then(
        function (contact) {
          //alert('Contact pick! '+ JSON.stringify(contact));
          console.log('The following contact has been selected:' + JSON.stringify(contact));
          //获取联系人的电话号码
          //alert(contact.phoneNumbers[0].value);
          //将联系人中的空格和特殊字符去掉
          //contact.phoneNumbers[0].value.replace(/[\s\-]/g,'')
          document.getElementById("telphone").value = contact.phoneNumbers[0].value.replace(/[\s\-]/g, '');
        },
        function (err) {
          //alert('Contact pick err!', err);
          //console.log(err);node_modules
        }
      );
    }
  })
  /*
   * Desc 我的圈子的页面展示
   * Author WK
   * Date 2017-3-3
   * */
  .controller('myCircleCtrl', function($scope,$state, $rootScope, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token=$.cookie("token");
    $scope.mycards=function(storeId){
      $state.go("tab.myCircleCard",{"storeId":storeId,"isGroupOwner": $scope.isGroupOwner});
    }
    //调用圈主的接口，查看信息
    $.ajax({
      url: $rootScope.interfaceUrl+"userGetGroupInfo",
      type:"POST",
      data: {
        "token":token,
        "storeId":$scope.storeId
      },
      success: function(result){
        console.log(result);
        if(result.code=='200'){
          $scope.$apply(function () {
            $scope.msg="";
          });
          //$state.go("tab.myCircleCard");
          $scope.groupName=result.groupName;
          //圈友
          $scope.storeList=result.storeList

        }else{
          $scope.$apply(function () {
            $scope.msg=result.msg;
          });
        }
      }
    });
  })

  /*
   * Desc 如何去这家店
   * Author WK
   * Date 2017-3-1
   * */
  .controller('shopMapCtrl', function($scope,$state, $rootScope, $stateParams,$cordovaLaunchNavigator) {
    $scope.longitude = $stateParams.longitude;
    $scope.latitude = $stateParams.latitude;
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    //导航
    $scope.launchNavigator = function() {
      navigator.geolocation.getCurrentPosition(function (data) {
        $scope.start = [data.coords.latitude, data.coords.longitude];
      });
      var destination = [$scope.latitude, $scope.longitude];
      $cordovaLaunchNavigator.navigate(destination, $scope.start).then(function() {
        console.log("Navigator launched");
      }, function (err) {
        console.error(err);
      });
    };
    navigator.geolocation.getCurrentPosition(function (data) {
      console.log(data);
      var longitude= data.coords.longitude;
      var latitude=data.coords.latitude;
      var map = new BMap.Map("allmap");
      //当前的位置
      var Point = new BMap.Point($scope.longitude,$scope.latitude);
      //店铺的位置
      var gpsPoint = new BMap.Point(longitude,latitude);  // 创建点坐标
      map.centerAndZoom(gpsPoint, 16);
      var marker = new BMap.Marker(gpsPoint);
      map.addOverlay(marker);
      var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
      map.addControl(ctrl_nav);//给地图添加缩放的按钮
      map.enableScrollWheelZoom(true);
      //根据经纬度来规划路线
      var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map,panel: "r-result", autoViewport: true}});
      walking.search(Point,gpsPoint);
    }, function (error) {
      console.log(error);
    }, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000, coorType: 'bd09ll'})

  })

  /*
   * Desc 圈子卡的充值
   * Author WK
   * Date 2017-3-1
   * */
  .controller('cirCleCardRechargeCtrl', function($scope,$state, $rootScope,$stateParams) {
    $scope.storeId=$stateParams.storeId;
    $scope.cardId=$stateParams.cardId;
    $scope.isGroupOwner=$stateParams.isGroupOwner;
    //支付宝和微信充值
    //单选按钮初始化
    $scope.ret = {choice: '100'};
    $scope.alipay=function (choice) {
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "aliPay",
          //"cardId": "213213123",
          "cardId":  $scope.cardId,
          "paymentService": "recharge",
          "subject": "库胖-充值",
          "totalFee": "0.01",
          "body": "充值"
        },
        success: function(result){
          console.log(result.payInfo);
          //第二步：调用支付插件
          cordova.plugins.AliPay.pay(result.payInfo, function success(e){
             //alert("成功了："+e.resultStatus+"-"+e.result+"-"+e.memo);
            //充值成功后回到圈子卡的页面
            $state.go("tab.myCircleCard",{
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            })
          }, function error(e){
             //alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin=function (choice) {
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "wxPay",
          //"cardId": "213213123",
          "cardId":  $scope.cardId,
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
             //alert("成功了："+e);
            //充值成功后回到圈子卡的页面
            $state.go("tab.myCircleCard",{
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            })
          }, function error (e) {
             //alert("失败了："+e);
          });
        }
      });

    };

  })
  //店铺卡的充值
  .controller('shopRechargeCtrl', function($scope,$state, $rootScope,$stateParams) {
    $scope.storeId=$stateParams.storeId;
    $scope.cardId=$stateParams.cardId;
    $scope.isGroupOwner=$stateParams.isGroupOwner;
    //支付宝和微信充值
    //单选按钮初始化
    $scope.ret = {choice: '100'};
    $scope.alipay=function (choice) {
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "aliPay",
          //"cardId": "213213123",
          "cardId":  $scope.cardId,
          "paymentService": "recharge",
          "subject": "库胖-充值",
          "totalFee": "0.01",
          "body": "充值"
        },
        success: function(result){
          console.log(result.payInfo);
          //第二步：调用支付插件
          cordova.plugins.AliPay.pay(result.payInfo, function success(e){
             //alert("成功了："+e.resultStatus+"-"+e.result+"-"+e.memo);
            //充值成功后回到圈子卡的页面
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            })
          }, function error(e){
             //alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin=function (choice) {
      $.ajax({
        url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type:"POST",
        data: {
          "paymentType": "wxPay",
          //"cardId": "213213123",
          "cardId":  $scope.cardId,
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
             //alert("成功了："+e);
            //充值成功后回到圈子卡的页面
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            })
          }, function error (e) {
             //alert("失败了："+e);
          });
        }
      });

    };

  })

  /*
   * Desc 我的圈子的卡的展示页面
   * Author WK
   * Date 2017-3-1
   * */
  .controller('myCircleCardCtrl', function ($scope, $state, $rootScope, $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
    if(token){
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
            $scope.cloudList = result.cloudCardList;

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
            $scope.cloudList = result.cloudCardList;

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

    $scope.chongZhi = function (storeId, cardId) {
      //跳转到充值的页面
      $state.go("tab.cirCleCardRecharge", {
        "storeId": storeId,
        "cardId": cardId,
        "isGroupOwner":$scope.isGroupOwner
      });
    }

    //买卡，开卡(圈子的卡)
    $scope.addCircleCard = function () {
      $state.go("tab.addCircleCard", {
        "storeId": $scope.storeId,
        "qrCode": $scope.qrCode,
        "isGroupOwner":$scope.isGroupOwner
      });
    }
  })

  /*
   * Desc 向商家买卡的业务处理
   * Author WK
   * Date 2017-3-1
   * */
  .controller('addCircleCardCtrl', function ($scope, $state, $rootScope, $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.qrCode = $stateParams.qrCode;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
    //这里是判断从扫一扫页面进入的还是从圈主圈友的页面进入的
    $scope.chooseCard = function () {
      $.ajax({
        url: $rootScope.interfaceUrl + "userScanCodeGetCardAndStoreInfo",
        type: "POST",
        data: {
          "token": token,
          "qrCode": $scope.qrCode
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            //$scope.groupName=result.groupName;
            //圈友
            //$scope.cloudList=result.cloudCardList
            $state.go("tab.chooseCard",
              {
                "storeId": result.storeId,
                "storeName": result.storeName,
                "qrCode": $scope.qrCode,
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
    //支付宝和微信支付
    //这里是向圈子卡里面充钱
    $scope.ret = {choice: '100'};
    $scope.alipay = function (choice, storeId) {
      //alert(storeId);
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
            $state.go("myCircleCard", {
              "storeId": storeId,
              "isGroupOwner": $scope.isGroupOwner,
            });
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };
    //调用微信支付
    $scope.weiXin = function (choice, storeId) {
      //alert(storeId);
      $.ajax({
        url: $rootScope.interfaceUrl + "purchaseCard", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type: "POST",
        data: {
          "paymentType": "wxPay",
          "storeId": storeId,
          "paymentService": "buyCard",
          //"totalFee": parseFloat(1) * 100,              // 微信金额不支持小数，这里1表示0.01
          "totalFee": "0.01",              // 微信金额不支持小数，这里1表示0.01
          "body": "库胖-充值",           // 标题不能使用中文
          "tradeType": "APP"
        },
        success: function (result) {
          console.log(result);
          //第二步：调用支付插件
          wxpay.payment(result, function success(e) {
            //alert("成功了：" + e);
            $state.go("myCircleCard", {
              "storeId": storeId,
              "isGroupOwner": $scope.isGroupOwner,
            });
          }, function error(e) {
            //alert("失败了：" + e);
          });
        }
      });

    };

  })

  /*
   * Desc 店铺的展示页面
   * Author WK
   * Date 2017-3-1
   * */
  .controller('shopCtrl', function ($scope, $state, $rootScope, $ionicScrollDelegate, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
    $.ajax({
      url: $rootScope.interfaceUrl + "getCardAndStoreInfoByStoreId",
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
          $scope.storeTeleNumber = result.storeTeleNumber;
          $scope.storeName = result.storeName;
          $scope.storeAddress = result.storeAddress;
          $scope.storeImg = result.storeImg;
          $scope.latitude = result.latitude;
          $scope.longitude = result.longitude;
        } else {
          $scope.$apply(function () {
            $scope.msg = result.msg;
          });
        }
      }
    });

    //通过圈主来购买圈子卡
    $scope.buyCircleCard=function(storeId,isGroupOwner){
      $state.go("tab.myCircleCard",{"storeId":storeId,"isGroupOwner":isGroupOwner});
    }

    //店铺没有加入圈子可以购买店里卡和圈子的卡的卡列表页面
    $scope.selectCircleCardAndShopCard=function(storeId){
      $state.go("tab.selectCircleCardAndShopCard", {
        "storeId": storeId,
        "isGroupOwner": $scope.isGroupOwner
      });
    }
  })

  //查询店铺的卡和圈子里的卡
  .controller('selectCircleCardAndShopCardCtrl', function ($scope, $state, $rootScope, $ionicScrollDelegate, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
    if(token){
      $.ajax({
        url: $rootScope.interfaceUrl + "getCardAndStoreInfoByStoreId",
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
            $scope.cloudList= result.cloudCardList;
            $scope.canBuyGroupCard= result.canBuyGroupCard;
            $scope.canBuyStoreCard= result.canBuyStoreCard;
            $scope.groupOwnerId= result.groupOwnerId;
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


    $scope.doRefresh=function(){
      $.ajax({
        url: $rootScope.interfaceUrl + "getCardAndStoreInfoByStoreId",
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
            $scope.cloudList= result.cloudCardList;
            $scope.canBuyGroupCard= result.canBuyGroupCard;
            $scope.canBuyStoreCard= result.canBuyStoreCard;
            $scope.groupOwnerId= result.groupOwnerId;
          } else {
            $scope.$apply(function () {
              $scope.msg = result.msg;
            });
          }
        }
      });
      $scope.$broadcast("scroll.refreshComplete");
    }
    //店里的卡充值
    $scope.shopCardchongZhi = function (storeId, cardId) {
      //跳转到充值的页面
      $state.go("tab.shopRecharge", {
        "storeId": storeId,
        "cardId": cardId,
        "isGroupOwner":$scope.isGroupOwner
      });
    }
    //通过圈主来购买圈子卡
    $scope.buyCircleCard=function(storeId){
      $state.go("tab.myCircleCard", {
        "storeId": storeId,
        "isGroupOwner": $scope.isGroupOwner
      });
    }


    //直接购买已加入圈子的圈子卡
    $scope.buyGroupCard=function(storeId,groupOwnerId){
      $state.go("tab.buyCardPay",{
        "storeId":storeId,
        "groupOwnerId":groupOwnerId,
        "isGroupOwner":$scope.isGroupOwner
      });
    }
    //都买店里的卡
    $scope.buyShopCard=function(storeId){
      $state.go("tab.buyShopCard",{
        "storeId":storeId,
        "isGroupOwner":$scope.isGroupOwner
      });
    }
  })

  //调用支付宝微信页面
  .controller('buyCardPayCtrl', function ($scope, $state, $rootScope, $ionicScrollDelegate, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.groupOwnerId = $stateParams.groupOwnerId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
    $scope.ret = {choice: '100'};
    $scope.alipay = function (choice, groupOwnerId) {
      $.ajax({
        url: $rootScope.interfaceUrl + "purchaseCard", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type: "POST",
        data: {
          "paymentType": "aliPay",
          "storeId": groupOwnerId,
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
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            });
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin = function (choice, groupOwnerId) {
      $.ajax({
        url: $rootScope.interfaceUrl + "purchaseCard", // wxPrepayOrder
        // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
        type: "POST",
        data: {
          "paymentType": "wxPay",
          "storeId": groupOwnerId,
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
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            });
            //$state.go("myCircleCard",{"storeId":storeId});
          }, function error(e) {
            //alert("失败了：" + e);
          });
        }
      });

    };



  })

  //购买店里卡调用支付宝微信
  .controller('buyShopCardCtrl', function ($scope, $state, $rootScope, $ionicScrollDelegate, $stateParams) {
    $scope.storeId = $stateParams.storeId;
    $scope.isGroupOwner = $stateParams.isGroupOwner;
    var token = $.cookie("token");
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
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
            });
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin = function (choice, groupOwnerId) {
      //alert(storeId);
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
            $state.go("tab.selectCircleCardAndShopCard", {
              "storeId": $scope.storeId,
              "isGroupOwner": $scope.isGroupOwner
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
   * Desc 付款码的展示页面
   * Author WK
   * Date 2017-3-1
   * */
  .controller('paymentCodeCtrl', function ($scope, $state, $rootScope, $stateParams,$interval) {
    $scope.qrCode = $stateParams.qrCode;
    $scope.refreshTime = $stateParams.refreshTime;
    var token=$.cookie("token");
    jQuery('.items').html("");
    jQuery('.items').qrcode($stateParams.qrCode);
   //刷新重新生成二维码
    $scope.n=$scope.refreshTime;
    var time=$interval(function () {
      $scope.n--;
      $scope.codeBtn=$scope.n;
      if($scope.n==0){
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
                  qrCode: result.qrCode,
                  refreshTime: result.refreshTime
                });
            } else {
              $scope.$apply(function () {
                $scope.msg = result.msg;
              });
            }
          }
        });
        $interval.cancel(time); // 取消定时任务
      }
    },1000);

    $scope.exitInterval=function(){
      $interval.cancel(time); // 取消定时任务
      $state.go("tab.index");
    }


    $scope.refresh=function(){
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
                qrCode: result.qrCode,
                refreshTime: result.refreshTime
              });
          } else {


            $scope.$apply(function () {
              $scope.msg = result.msg;
            });
          }
        }
      });

    }
  })

  /*
   * Desc 我的圈子的定位显示
   * Author WK
   * Date 2017-3-1
   * */
  .controller('circleMapCtrl', function ($scope, $state,$ionicPopover, $rootScope, $cordovaBarcodeScanner, $ionicPopup, $ionicLoading, $timeout, $stateParams) {
    //用于显示圈子或者店铺的详细的信息

    var token = $.cookie("token");
    $scope.storeInfo = false;
    //隐藏footer
    $scope.diglogHide = function () {
      $scope.storeInfo = false;
    }



    //付款码
    $scope.paymentCode = function () {
      if(token){
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
      }else{
        $state.go("login");
      }


    }
    //扫一扫
    $scope.scanBarcode = function () {
      //var qrCode="ccs-ec9cd1cf-200f-4d4c-8946-f3eaaf2885d4";
    //  var qrCode="ccs-3faf754a-c9e0-4cfe-8bd7-48d55739cc43";
      //真正的代码
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
    }
    //百度定位
    $timeout(function () {//解决网络延时带来的卡顿
      navigator.geolocation.getCurrentPosition(function (data) {
        //var point = (121.419634, 31.207267);
        //$scope.ret = {longitude:121.419633, latitude:31.207256};
        //alert(data.coords.longitude);
        var map = new BMap.Map("allmap");
        var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
        var token = $.cookie("token");
        var platform=$.cookie("platform");
        //解决ios偏移的问题
        if(platform === 'iOS'){
          //ios gps偏移
          var ggPoint = new BMap.Point(data.coords.longitude,data.coords.latitude);
          //添加gps marker和label
          var markergg = new BMap.Marker(ggPoint);
          //坐标转换完之后的回调函数
          translateCallback = function (data){
            if(data.status === 0) {
              var marker = new BMap.Marker(data.points[0]);
              map.centerAndZoom(data.points[0], 16);
              map.addOverlay(marker);
              var myLabels = new BMap.Label("我的位置", //为lable填写内容
                {offset:new BMap.Size(10,-20)}); //label的位置
              myLabels.setStyle({ //给label设置样式，任意的CSS都是可以的
                "color": "blue", //颜色
                "fontSize": "12px", //字号
                "border": "0", //边
                "height": "10px", //高度
                "width": "20px" //宽
              });
              marker.setLabel(myLabels); //添加百度label
              map.addControl(ctrl_nav);//给地图添加缩放的按钮
            }
          }

          setTimeout(function(){
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 1, 5, translateCallback)
          }, 1000);
        }else{
          //显示当前我的位置
          var Point = new BMap.Point(data.coords.longitude, data.coords.latitude);  // 创建点坐标
          map.centerAndZoom(Point, 16);
          var marker = new BMap.Marker(Point);
          map.addOverlay(marker);
          var myLabels = new BMap.Label("我的位置", //为lable填写内容
            {position: Point,offset:new BMap.Size(10,-20)}); //label的位置
          myLabels.setStyle({ //给label设置样式，任意的CSS都是可以的
            "color": "blue", //颜色
            "fontSize": "12px", //字号
            "border": "0", //边
            "height": "10px", //高度
            "width": "20px" //宽
          });
          map.addOverlay(myLabels);
          map.addControl(ctrl_nav);//给地图添加缩放的按钮
        }

        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl({ offset:new BMap.Size(10,80)});
        geolocationControl.addEventListener("locationSuccess", function(e){
          // 定位成功事件
          var longitude= data.coords.longitude;
          var latitude=data.coords.latitude
          //请求后台查询店铺
          $.ajax({
            url: $rootScope.interfaceUrl + "userStoreListLBS",
            type: "POST",
            data: {
              "token": token,
              "longitude": longitude,
              "latitude": latitude
            },
            success: function (result) {
              //alert(result.code);
              console.log(result);
              if (result.code == '200') {
                $ionicPopup.alert({
                  title: '温馨提示',
                  template: "位置更新成功"
                });
                for (var o in result.storeList) {
                  var storeName = result.storeList[o].storeName;
                  var storeId = result.storeList[o].storeId;
                  var distance = result.storeList[o].distance;
                  var location = eval(result.storeList[o].location);
                  var longitude = location[0];
                  var latitude = location[1];
                  var isGroupOwner = result.storeList[o].isGroupOwner;
                  var isHasCard = result.storeList[o].isHasCard;
                  var address = result.storeList[o].address;
                  var telNum = result.storeList[o].telNum;
                  var gpsPoint = new BMap.Point(longitude, latitude);  // 创建点坐标
                  map.centerAndZoom(gpsPoint, 16);
                  var marker = new BMap.Marker(gpsPoint);

                  if (isHasCard == 'N') {//如果是圈主的话就将默认的marker变成蓝色
                    var icon = new BMap.Icon("img/blueMarket.png", new BMap.Size(20, 32)); //icon_url为自己的图片路径
                    var marker = new BMap.Marker(gpsPoint, {icon: icon});
                  }
                  map.addOverlay(marker);

                  map.enableScrollWheelZoom(true);
                  var myLabel = new BMap.Label(storeName, //为lable填写内容
                    {position: gpsPoint}); //label的位置
                  myLabel.setStyle({ //给label设置样式，任意的CSS都是可以的
                    "color": "red", //颜色
                    "fontSize": "12px", //字号
                    "border": "0", //边
                    "height": "10px", //高度
                    "width": "20px" //宽
                  });
                  map.addOverlay(myLabel);


                  (function (p, m, storeName, isGroupOwner, distance, storeId, address, telNum) {

                    m.addEventListener("click", function () {
                      $scope.$apply(function () {
                        $scope.storeInfo = true;
                        $scope.storeName = storeName;
                        $scope.storeId = storeId;
                        $scope.isGroupOwner = isGroupOwner;
                        $scope.distance = distance;
                        $scope.telNum = telNum;
                        $scope.address = address;
                      });

                    })
                  })(gpsPoint, marker, storeName
                    , isGroupOwner, distance, storeId, address, telNum);
                }
              } else {
                $ionicPopup.alert({
                  title: '温馨提示',
                  template: result.msg
                });
              }
            }
          });
        });

        map.addControl(geolocationControl);

        //请求后台查询店铺
          $.ajax({
            url: $rootScope.interfaceUrl + "userStoreListLBS",
            type: "POST",
            data: {
              "token": token,
              "longitude": data.coords.longitude,
              "latitude": data.coords.latitude
            },
            success: function (result) {
              //alert(result.code);
              console.log(result);
              if (result.code == '200') {
                for (var o in result.storeList) {
                  var storeName = result.storeList[o].storeName;
                  var storeId = result.storeList[o].storeId;
                  var distance = result.storeList[o].distance;
                  var location = eval(result.storeList[o].location);
                  var longitude = location[0];
                  var latitude = location[1];
                  var isGroupOwner = result.storeList[o].isGroupOwner;
                  var isHasCard = result.storeList[o].isHasCard;
                  var address = result.storeList[o].address;
                  var telNum = result.storeList[o].telNum;
                  var gpsPoint = new BMap.Point(longitude, latitude);  // 创建点坐标
                  map.centerAndZoom(gpsPoint, 16);
                  var marker = new BMap.Marker(gpsPoint);

                  if (isHasCard == 'N') {//如果是圈主的话就将默认的marker变成蓝色
                    var icon = new BMap.Icon("img/blueMarket.png", new BMap.Size(20, 32)); //icon_url为自己的图片路径
                    var marker = new BMap.Marker(gpsPoint, {icon: icon});
                  }
                  map.addOverlay(marker);

                  map.enableScrollWheelZoom(true);
                  var myLabel = new BMap.Label(storeName, //为lable填写内容
                    {position: gpsPoint}); //label的位置
                  myLabel.setStyle({ //给label设置样式，任意的CSS都是可以的
                    "color": "red", //颜色
                    "fontSize": "12px", //字号
                    "border": "0", //边
                    "height": "10px", //高度
                    "width": "20px" //宽
                  });
                  map.addOverlay(myLabel);


                  (function (p, m, storeName, isGroupOwner, distance, storeId, address, telNum) {

                    m.addEventListener("click", function () {
                      $scope.$apply(function () {
                        $scope.storeInfo = true;
                        $scope.storeName = storeName;
                        $scope.storeId = storeId;
                        $scope.isGroupOwner = isGroupOwner;
                        $scope.distance = distance;
                        $scope.telNum = telNum;
                        $scope.address = address;
                      });

                    })
                  })(gpsPoint, marker, storeName
                    , isGroupOwner, distance, storeId, address, telNum);
                }
              } else {
                $ionicPopup.alert({
                  title: '温馨提示',
                  template: result.msg
                });
              }
            }
          });



      }, function (error) {
        //alert("网络不可用，请打开网络!!");
        console.log(error);

      }, {timeout: 10000, enableHighAccuracy: true, maximumAge: 75000, coorType: 'bd09ll'});
    },800);


  })
  /*
   * Desc 通过二维码查询店铺中自己可以用的卡
   * Author WK
   * Date 2017-3-1
   * */
  .controller('chooseCardCtrl', function ($scope, $stateParams, $state, $rootScope) {
    $scope.storeId = $stateParams.storeId;
    $scope.storeName = $stateParams.storeName;
    $scope.qrCode = $stateParams.qrCode;
    $scope.canBuyGroupCard = $stateParams.canBuyGroupCard;
    $scope.canBuyStoreCard = $stateParams.canBuyStoreCard;
    $scope.groupOwnerId = $stateParams.groupOwnerId;
    $scope.cloudCardList = JSON.parse($state.params.cloudCardList);
    console.log(JSON.parse($state.params.cloudCardList));
    var token = $.cookie("token");
    //选卡支付的操作
    $scope.paymentToCode = function (cardId) {
      $state.go("tab.payment", {
        "qrCode": $scope.qrCode,
        "storeName": $scope.storeName,
        "storeId": $scope.storeId,
        "cardId": cardId,
        "chooseCardStatus": 'Y'
      });
    }
    //JSON.parse($state.params.cloudCardList) 将对象转换为数组
    //这是扫一扫买卡的操作
    //这里是买店里的卡
    $scope.scanAddGroupCard = function (qrCode,groupOwnerId) {
      $state.go("tab.scanAddGroupCard", {
        "storeId": $scope.storeId,
        "qrCode": $scope.qrCode,
        "groupOwnerId": groupOwnerId
      });
    }
    //这是买圈子的卡
    $scope.scanAddCard = function (qrCode) {
      $state.go("tab.scanAddCard", {
        "storeId": $scope.storeId,
        "qrCode": $scope.qrCode
      });
    }

    //下拉刷新的操作，，****如果是充卡支付成功之后卡的金额没有发生变化的操作
    $scope.doRefresh = function () {
      $.ajax({
        url: $rootScope.interfaceUrl + "userScanCodeGetCardAndStoreInfo",
        type: "POST",
        data: {
          "token": token,
          "qrCode": $scope.qrCode
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            //$scope.groupName=result.groupName;
            //圈友
            //$scope.cloudList=result.cloudCardList
            $state.go("tab.chooseCard",
              {
                "storeId": result.storeId,
                "storeName": result.storeName,
                "qrCode": $scope.qrCode,
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
      $scope.$broadcast("scroll.refreshComplete");
    }
  })
  /*
   * Desc 扫一扫向商家购买圈子的卡的逻辑判断
   * Author WK
   * Date 2017-3-1
   * */
  .controller('scanAddCardCtrl', function ($scope, $stateParams, $state, $rootScope) {
    $scope.storeId = $stateParams.storeId;
    $scope.qrCode = $stateParams.qrCode;
    var token = $.cookie("token");

    //这里是返回的操作到所以扫后的圈子卡的列表
    $scope.chooseCard = function () {
      $.ajax({
        url: $rootScope.interfaceUrl + "userScanCodeGetCardAndStoreInfo",
        type: "POST",
        data: {
          "token": token,
          "qrCode": $scope.qrCode
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            //$scope.groupName=result.groupName;
            //圈友
            //$scope.cloudList=result.cloudCardList
            $state.go("tab.chooseCard",
              {
                "storeId": result.storeId,
                "storeName": result.storeName,
                "qrCode": $scope.qrCode,
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
    //这里是通过扫一扫来买圈子的卡
    $scope.ret = {choice: '100'};
    $scope.alipay = function (choice, storeId) {
      //alert(storeId);
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
            $scope.chooseCard();
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin = function (choice, storeId) {
      //alert(storeId);
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
            $scope.chooseCard();
            //$state.go("myCircleCard",{"storeId":storeId});
          }, function error(e) {
            //alert("失败了：" + e);
          });
        }
      });

    };

  })
  //这是购买圈子里的卡
  .controller('scanAddGroupCardCtrl', function ($scope, $stateParams, $state, $rootScope) {
    $scope.storeId = $stateParams.storeId;
    $scope.qrCode = $stateParams.qrCode;
    $scope.groupOwnerId = $stateParams.groupOwnerId;
    var token = $.cookie("token");

    //这里是返回的操作到所以扫后的圈子卡的列表
    $scope.chooseCard = function () {
      $.ajax({
        url: $rootScope.interfaceUrl + "userScanCodeGetCardAndStoreInfo",
        type: "POST",
        data: {
          "token": token,
          "qrCode": $scope.qrCode
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            //$scope.groupName=result.groupName;
            //圈友
            //$scope.cloudList=result.cloudCardList
            $state.go("tab.chooseCard",
              {
                "storeId": result.storeId,
                "storeName": result.storeName,
                "qrCode": $scope.qrCode,
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
    //这里是通过扫一扫来买圈子的卡
    $scope.ret = {choice: '100'};
    $scope.alipay = function (choice, storeId) {
      //alert(storeId);
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
            $scope.chooseCard();
          }, function error(e) {
            // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
          });
        }
      });
    };

    $scope.weiXin = function (choice, storeId) {
      //alert(storeId);
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
            $scope.chooseCard();
            //$state.go("myCircleCard",{"storeId":storeId});
          }, function error(e) {
            //alert("失败了：" + e);
          });
        }
      });

    };

  })
  //其他授权的方式
.controller('DashCtrl', function($scope,$stateParams) {
    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.fromDate = $stateParams.fromDate;
    $scope.thruDate = $stateParams.thruDate;
    $scope.cardName = $stateParams.cardName;
  })

  //C端跳转成功页面的传值
.controller('paymentSuccessCtrl', function($scope,$stateParams) {
    $scope.type = $stateParams.type;
    $scope.cardId = $stateParams.cardId;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;

  })
  //转卡成功后的跳转页面
.controller('sellCardSuccessCtrl', function($scope,$stateParams) {
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.tel = $stateParams.tel;
  })
  //c端扫码消费成功之后的页面跳转
.controller('userPaymentSuccessCtrl', function($scope,$stateParams) {
    $scope.storeName = $stateParams.storeName;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.type = $stateParams.type;
  })
  //默认授权的方式
.controller('DashAccreditCtrl', function($scope,$stateParams) {
    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.day = $stateParams.day;
    $scope.cardName = $stateParams.cardName;
  })

.controller('ChatsCtrl', function($scope, Chats,$state, $rootScope, $ionicScrollDelegate) {
  $scope.chats = Chats.all();
    $scope.doRefresh = function() {
      $scope.chats = Chats.all();
      $scope.$broadcast("scroll.refreshComplete");
    };

})


/*
 * Desc 分账单的页面查询
 * Author WK
 * Date 2016-11-18
 * */
  .controller('subBillCtrl', function($scope, aboutMeService,$state,$rootScope,$stateParams) {
    $scope.cardId = $stateParams.cardId;
    //分账单
    aboutMeService.subBillService(0,$scope.cardId).success(function (data) {
      $scope.paymentsList=data.paymentsList;
      function getTransDateYearMonth(obj){
        var transDate = parseInt(obj.transDate);
        var date = new Date(transDate);
        return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
      }
      $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
    })

    //全部账单
    $scope.all=function(typeId){
      aboutMeService.subBillService(typeId,$scope.cardId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      })
    }
//总消费账单
    $scope.zongConsume=function(typeId){
      aboutMeService.subBillService(typeId,$scope.cardId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      })
    }
    //总充值账单
    $scope.zongRecharge=function(typeId){
      aboutMeService.subBillService(typeId,$scope.cardId).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      })
    }


    //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.get($scope.cardId);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

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


//授权的controller
  .controller('inputCtrl', function ($scope, $stateParams, $rootScope, $http, Chats, $state, $ionicPopup, ionicDatePicker) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode = $stateParams.cardCode;
    $scope.isAuthToOthers = $stateParams.isAuthToOthers;
    $scope.isAuthToMe = $stateParams.isAuthToMe;
    var token = $.cookie("token");

    var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        var selectDate = new Date(val);
        console.log(selectDate.getFullYear() + "-" + parseFloat(selectDate.getMonth() + 1) + "-" + selectDate.getDate());
        $("#other_startDate").val(selectDate.getFullYear() + "-" + parseFloat(selectDate.getMonth() + 1) + "-" + selectDate.getDate());
      },
      disabledDates: [            //Optional
        new Date(),
        new Date(1439676000000)
      ],
      //from: new Date(1990, 1, 1), //Optional
      //to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: false,          //Optional
      closeOnSelect: false,
      templateType: 'popup'       //Optional
    };
    var ipObj2 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        var selectDate = new Date(val);
        console.log(selectDate.getFullYear() + "-" + parseFloat(selectDate.getMonth() + 1) + "-" + selectDate.getDate());
        $("#other_endDate").val(selectDate.getFullYear() + "-" + parseFloat(selectDate.getMonth() + 1) + "-" + selectDate.getDate());
      },
      from: new Date(1990, 1, 1), //Optional
      to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: false,          //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function () {
      ionicDatePicker.openDatePicker(ipObj1);
    };
    $scope.openDatePicker2 = function () {
      ionicDatePicker.openDatePicker(ipObj2);
    };


    $("body").off("click", "#powerfrom").on("click", "#powerfrom", function () {
      $other_tel = $("#telphone").val();
      $other_cardId = $("#other_cardId").val();
      //$other_money=$("#other_money").val();
      $other_startDate = $("#other_startDate").val();
      $other_endDate = $("#other_endDate").val();

      var flag = true;

      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test($other_tel)) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请输入正确的手机号码",
          okText: "确定",
        })
        flag = false;
      }
      //正则验证输入金额是否合法
      // var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
      // if (moneyReg.test($other_money)) {
      //    if(parseFloat($other_money) > parseFloat($scope.cardBalance)){
      //
      //      $ionicPopup.alert({
      //        title:"温馨提示",
      //        template:"授权金额大于可用金额",
      //        okText:"确定",
      //      })
      //      flag = false;
      //    }
      // }else{
      //   $ionicPopup.alert({
      //     title:"温馨提示",
      //     template:"金额输入有误,请重新输入",
      //     okText:"确定",
      //
      //   })
      //      flag = false;
      // }

      if ($other_endDate == null | $other_endDate == '') {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请将时间填写完整",
          okText: "确定",
        })
        //var nowtime = new Date();
        //$other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
        flag = false;
      }
      if ($other_startDate == null | $other_startDate == '') {
        //var nowtime2 = new Date();
        //$other_endDate = nowtime2.toLocaleDateString().replace('/','-').replace('/','-');
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请将时间填写完整",
          okText: "确定",
        })
        flag = false;
      }
      if ($other_startDate > $other_endDate) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "截止时间应大于授权时间",
          okText: "确定",
        })
        flag = false;
      }
      if (flag) {
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "createCardAuth",
          async: false,
          data: {
            "token": token,
            "cardId": $other_cardId,
            "teleNumber": $other_tel,
            //"amount":$other_money,
            "fromDate": $other_startDate,
            "thruDate": $other_endDate
          },
          dataFilter: function (data) {
            console.log("raw data: " + data);
            var idx = data.indexOf("//");
            if (data && /^\s*\/\/.*/.test(data) && idx > -1) {
              data = data.substring(idx + 2);
            }
            return data;
          },
          success: function (data) {
            console.log(data);
            if (data.code == 500) {
              $ionicPopup.alert({
                title: "温馨提示",
                template: data.msg,
                okText: "确定",

              })
            }
            //跳转到登录的页面
            if (data.code == 400) {
              $state.go("login");
            }
            if (data.code == 200) {
              //授权成功，传入必要的参数，跳转到授权成功的查看页面
              window.location.href = "#/tab/cardreturn/" + $other_tel + "/" + $scope.cardBalance + "/" + $other_startDate + "/" + $other_endDate + "/" + $scope.cardName;
            }


          },
          error: function (e) {
            console.log(e);

            window.location.href = "#/tab/cardinput";
          }
        });


      }
      ;
    });
  })


  /*
   * Desc 转卡页面的传值
   * Author WK
   * Date 2016-11-18
   * */
  .controller('inputsellCardCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode = $stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

    $scope.sellCard=function(cardName,cardBalance){
      var tel=$("#telphone").val();
      var token=$.cookie("token");

      var flag =true;
      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test(tel)) {
        $scope.msg = '手机号码输入有误，请重新输入！！';
        //$("#telphone").val(" ");
        flag = false;
      }
      $ionicPopup.confirm({
          title:"转卡",
          template:"是否确认转卡??",
          okText:"确定",
          cancelText:"取消"
        })
        .then(function(res){
          if(res) {
            if(flag){
              $.ajax({
                url:$rootScope.interfaceUrl+"modifyCardOwner",
                type:"POST",
                data: {
                  "token":token,
                  "teleNumber":tel,
                  "cardId":$scope.cardId
                },
                success: function(result){
                  console.log(result);
                  if(result.code=="200"){
                    $state.go("tab.sellCardSuccess",{
                      "cardBalance":cardBalance,
                      "cardName":cardName,
                      "tel":tel
                    });
                  }
                  if(result.code==500){
                    $ionicPopup.alert({
                      title:"温馨提示",
                      template:data.msg,
                      okText:"确定",

                    })
                    //alert("授权失败,"+data.msg);
                  }
                  //跳转到登录的页面
                  if(result.code==400){
                    $state.go("login");
                  }
                }
              });
            }
          }
          })


    }
  })


  /*
   * Desc 授权的默认界面
   * Author WK
   * Date 2016-11-18
   * */
  .controller('inputAccreditCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
    $scope.cardId  =$stateParams.cardId;
    $scope.cardBalance  =$stateParams.cardBalance;
    $scope.cardName  =$stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;
    var token=$.cookie("token");

    $scope.daylist = [
      { text: "一天", value: "1" },
      { text: "永久", value: "0" }

    ];
    //给默认的初始值
    $scope.ret={choice:'1'};

    $("body").off("click", "#powerfrom").on("click","#powerfrom", function() {
      $other_tel=$("#telphone").val();
      $other_cardId=$("#other_cardId").val();
      $other_money=$("#other_money").val();
      $day=$("#day").val();
      var flag =true;

      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test($other_tel)) {
        $ionicPopup.alert({
          title:"温馨提示",
          template:"请输入正确的手机号码",
          okText:"确定",
        })
        flag = false;
      }
      //正则验证输入金额是否合法
      var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
      if (moneyReg.test($other_money)) {
        if(parseFloat($other_money) > parseFloat($scope.cardBalance)){

          $ionicPopup.alert({
            title:"温馨提示",
            template:"授权金额大于可用金额",
            okText:"确定",
          })
          flag = false;
        }
      }else{
        $ionicPopup.alert({
          title:"温馨提示",
          template:"金额输入有误,请重新输入",
          okText:"确定",

        })
        flag = false;
      }

      if(flag){
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl+"createCardAuth",
          async: false,
          data: {
            "token":token,
            "cardId":$other_cardId,
            "teleNumber":$other_tel,
            //"amount":$other_money,//默认授权的金额默认先不填，为了保证金额的正确性
            "day":$day
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
              //alert("授权失败,"+data.msg);
            }
            //跳转到登录的页面
            if(data.code==400){
              $state.go("login");
            }
            if(data.code==200){
              //授权成功，传入必要的参数，跳转到授权成功的查看页面
              window.location.href="#/tab/cardreturnsuccess/"+$other_tel+"/"+$other_money+"/"+$day+"/"+$scope.cardName;
            }

          },
          error:function (e) {
            console.log(e);

            window.location.href="#/tab/cardinput";
          }
        });


      };
    });
  })

  /*
   * Desc 账单信息
   * Author WK
   * Date 2016-11-18
   * */
.controller('CardDetailCtrl', function($scope,CardDetail,$rootScope,$ionicLoading,$timeout) {
  $scope.items=[
    {text:"0",value:"全部"},
    {text:"1",value:"充值"},
    {text:"2",value:"消费"}
  ];
  //默认选择全部
  $scope.ret={choice:'0'};
  var viewSize=20;//账单一开始默认加载20条数据
  $scope.cardDetails = CardDetail.all(0,viewSize);
  $scope.cardDetail = $scope.cardDetails;

  //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      var viewSize=20000;
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.all(0,viewSize);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

    };
  //上拉触发函数,总账单的下拉加载更多内容
     $scope.loadMore = function () {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $scope.cardDetailsSS = CardDetail.all(0, 20000);
      if (viewSize < $scope.cardDetailsSS.length) {//当页面显示的条数小于总条数是下拉加载才生效
        $ionicLoading.show({
          template: "正在加载数据...."
        });
        $timeout(function () {
          $ionicLoading.hide();
          viewSize += 20;
          $scope.ret = {choice: '0'};
          $scope.cardDetails = CardDetail.all(0, viewSize);
          $scope.cardDetail = $scope.cardDetails;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
      } else {
        //结束加载的转圈
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

  };

  //下拉列表分类显示，这种方式主要是通过后台去查询，这样做可以实现效果但是如果数据量比较大的话就会导致系统卡
  //$scope.change = function(amountType){
  //  console.log(amountType);
  //  var cardDetail = CardDetail.all(amountType);                                   // 商家账单
  //  $scope.cardDetail = cardDetail;
  //}
  //下拉列表分类显示，查询全部是请求后台，按照类型去查询的时候就使用_.filter在查询出来的数据进行过滤
  $scope.change = function(amountType){

    //第一次查询全部的时候调用后台去查询一下
      //-.filter  lodash实现过滤，利用第一次查询的数据第二次做筛选
      //$scope.cardDetail =  _.filter($scope.cardDetails, function(o){  //提高效率（从缓存中过滤数据，不用请求后台，好屌）
      //  return o.type==amountType;
      //});
      $scope.cardDetail = CardDetail.all(amountType, viewSize);
      $scope.loadMore = function () {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $scope.cardDetailsSS = CardDetail.all(amountType, 20000);
        if (viewSize < $scope.cardDetailsSS.length) {//当页面显示的条数小于总条数是下拉加载才生效
          $ionicLoading.show({
            template: "正在加载数据...."
          });
          $timeout(function () {
            $ionicLoading.hide();
            viewSize += 20;
            $scope.cardDetails = CardDetail.all(amountType, viewSize);
            $scope.cardDetail = $scope.cardDetails;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
        } else {
          //结束加载的转圈
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

  }

  })




/*
 * Desc 退出登录
 * Author LN
 * Date 2016-11-24
 * */
  .controller('settingCtrl', function($scope,$state,$ionicPopup,$rootScope) {
    var token=$.cookie("token");
    var registrationID=$.cookie("registrationID");
    $scope.outLogin=function () {

      $ionicPopup.confirm({
          title:"退出",
          template:"是否退出要退出登录",
          okText:"确定",
          cancelText:"取消"
        })
        .then(function(res){
          if(res){

            $.cookie('token', null);
            $.cookie('organizationPartyId', null);
            //极光推送开始
            //退出时销毁极光推送的registrationID
            $.ajax(
              { url: $rootScope.interfaceUrl+"removeJpushRegId",
                type:"POST",
                data: {
                  "token":token,
                  "regId":registrationID
                },
                success: function(result){
                  //alert(result.msg);
                }
              });

            $state.go("login");//跳转到登录页面
          }
        })

    }
  })



  /*
   * Desc 获取验证码
   * Author LN
   * Date 2016-11-24
   * */
.controller('LoginCtrl', function($scope,$interval,$rootScope,$http,$state) {
  // $scope.tel='15910989807';
  //$scope.user={
  //  tel:"18702104254"
  //};
  //为了让安卓手机按返回时不跳到登陆页面，判断tooken
  $scope.$on('$ionicView.beforeEnter', function () {                           // 这个玩意儿不错，刚加载执行的广播通知方法
    if ($.cookie("token") != null) { // 登录成功了，按物理返回键，就别想重新登录
      //$state.go("tab.chats");
      //$state.go("tab.circleMap");
      $state.go("tab.index");
    }
  });
  $scope.codeBtn='获取验证码';

  $scope.getIdentifyCode=function (tel) {
    $scope.msg="";//先清空错误提示
    if(tel){
      $http({
        method: "POST",
        url: $rootScope.interfaceUrl+"getLoginCaptcha",
        data: {
          "teleNumber":tel
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
        transformRequest: function(obj) { // 参数是对象的话，需要把参数转成序列化的形式
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).success(function (result) {
          // console.log(result);
          if(result.code=='500'){
                $scope.msg=result.msg;
          }else{
            //倒计时
            $scope.n=60;
            $scope.codeBtn="获取中 "+$scope.n+" 秒";
            var time=$interval(function () {
              $scope.n--;
              $scope.codeBtn="获取中 "+$scope.n+" 秒";
              if($scope.n==0){
                $interval.cancel(time); // 取消定时任务
                $scope.codeBtn='获取验证码';
                $scope.codeBtnDisable=false;
              }
            },1000);
            $scope.codeBtnDisable=true;
          }
      });


    }else{
        $scope.msg="请输入您的手机号码！！"
    }
  };
})

/*
 * Desc 登陆
 * Author LN
 * Date 2016-11-24
 * */
.controller('login', function($scope,$rootScope,$state) {

    $scope.cloudCardLogin=function () {
      console.log($scope.user.tel+" "+$scope.user.identifyCode);
      $.ajax({
        url: $rootScope.interfaceUrl+"userAppLogin",
        type:"POST",
        data: {
          "teleNumber":$scope.user.tel,
          "captcha":$scope.user.identifyCode
        },
        success: function(result){
          // console.log(result.code+" "+result.msg);
          if(result.code=='200'){
            var registrationID=$.cookie("registrationID");
            var platform=$.cookie("platform");
            $scope.$apply(function () {
              $scope.msg="";
            });
            //将token 存入cookie 过期时间7天
            $.cookie("token",result.token,{
              expires:7
            });
            $.ajax(
              { url: $rootScope.interfaceUrl+"regJpushRegId",
                type:"POST",
                data: {
                  "token":result.token,
                  "regId":registrationID,
                  "deviceType":platform,
                  "appType":"user"
                },
                success: function(result){
                  //极光推送后台数据获取
                }
              });
            //$state.go("tab.chats");
            //$state.go("tab.circleMap");
            $state.go("tab.index");
            // location.href="http://"+location.host+"/#/tab/chats";
          }else{
            $scope.$apply(function () {
              $scope.msg=result.msg;
            });
          }
        }
      });

    }
})

/*
 * Desc 扫码消费
 * Author wk
 * Date 2016-11-24
 * */
  .controller("scanPaymentController", function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicPopup, $ionicLoading, $timeout, $stateParams) {
    var token = $.cookie("token");
    $scope.cardId = $stateParams.cardId;
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

  /*
   * Desc 选卡支付页面
   * Author wk
   * Date 2017-3-3
   * */
//调到向商家付款的页面
  .controller('paymentController', function ($scope, $state, $stateParams, $rootScope, $ionicLoading, $ionicPopup) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }
    //页面信息初始化
    $scope.qrCode = $stateParams.qrCode;
    $scope.storeName = $stateParams.storeName;
    $scope.storeId = $stateParams.storeId;
    //$scope.storeImgUrl = $stateParams.storeImgUrl;//可能会存在转义字符
    $scope.cardId = $stateParams.cardId;
    $scope.chooseCardStatus = $stateParams.chooseCardStatus;
     //返回到选卡的页面
    $scope.chooseCard=function(){
      $.ajax({
        url: $rootScope.interfaceUrl+"userScanCodeGetCardAndStoreInfo",
        type:"POST",
        data: {
          "token":token,
          "qrCode":$scope.qrCode
        },
        success: function(result){
          console.log(result);
          if(result.code=='200'){
            $scope.$apply(function () {
              $scope.msg="";
            });
            //$scope.groupName=result.groupName;
            //圈友
            //$scope.cloudList=result.cloudCardList
            $state.go("tab.chooseCard",
              {
                "storeId": result.storeId,
                "storeName":result.storeName,
                "qrCode":$scope.qrCode,
                "hasGroupCard":result.hasGroupCard,//是否有圈子卡
                "hasStoreCard":result.hasStoreCard,//是否有店的卡
                "groupOwnerId":result.groupOwnerId,//圈子的id
                "cloudCardList":JSON.stringify(result.cloudCardList)
              });
          }else{
            $scope.$apply(function () {
              $scope.msg=result.msg;
            });
          }
        }
      });
    }
    //付款的调用接口
    $scope.paymentMethod=function(amount) {
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
        }else {
          $.ajax({
            url: $rootScope.interfaceUrl + "customerWithdraw",
            type: "POST",
            data: {
              "token": token,
              "qrCode": $stateParams.qrCode,
              "amount":amount,
              "cardId": $stateParams.cardId
            },
            success: function (result) {
              //alert(result.msg+" "+result.storeName+" "+result.cardBalance+" "+"支付成功");
              if (result.code == '200') {
                $state.go("tab.userPaymentSuccess", {
                  storeName: result.storeName,
                  amount: result.amount,
                  cardBalance: result.cardBalance,
                  "type": "payment"
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
      }
    }

  })


  /*
   * Desc 充值页面
   * Author LN
   * Date 2016-12-12
   * */
  .controller('rechargeCtrl', function ($scope, $stateParams, $rootScope,$state, $ionicLoading) {
    //页面信息初始化
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

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
              // alert("成功了："+e.resultStatus+"-"+e.result+"-"+e.memo);
              $state.go("tab.chats");
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
              $state.go("tab.chats");
            }, function error (e) {
                 //alert("失败了："+e);
            });
          }
        });

    };

  })

;

