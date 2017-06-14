angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic-datepicker','aboutMe.controllers','aboutMe.services',
                           'mycircle.controllers','mycircle.services','index.controllers','index.services'])

.run(function($ionicPopup,$ionicPlatform,$rootScope,$state) {
  //当设备运行的时候就执行
  //$rootScope.interfaceUrl="http://121.40.214.81:8080/cloudcard/control/"; //接口前一截一样的
  //$rootScope.interfaceUrl="http://192.168.3.13:8080/cloudcard/control/"; //接口前一截一样的
   $rootScope.interfaceUrl="http://139.196.112.121:8080/cloudcard/control/"; //接口前一截一样的
  //$rootScope.interfaceUrl="https://kayunka.c1337y.com/cloudcard/control/"; //接口前一截一样的
  //$rootScope.interfaceUrl="https://kayunka.weibeitech.com/cloudcard/control/"; //接口前一截一样的

  //调用极光推送
  //极光推送开始

  // 当设备就绪时
  var onDeviceReady = function () {
    //$scope.message += "JPushPlugin:Device ready!";
    initiateUI();
  };

  // 打开通知的回调函数
  var onOpenNotification = function (event) {
    try {
      var alertContent;
      if (device.platform == "Android") {
        alertContent = window.plugins.jPushPlugin.openNotification.alert;
      } else {
        alertContent = event.aps.alert;
      }
      //$scope.message = alertContent;
      //alert(alertContent+"打开通知后的跳转页面");
    } catch (exception) {
      console.log("JPushPlugin:onOpenNotification" + exception);
    }
  };
  // 接收到通知时的回调函数
  var onReceiveNotification = function (event) {
    try {
      var alertContent;
      if (device.platform == "Android") {
        alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
      } else {
        alertContent = event.aps.alert;
      }
      //$scope.message = alertContent;
      //$scope.notificationResult = alertContent;
      //alert($scope.message+"接受通知");
    } catch (exception) {
      console.log(exception)
    }
  };

  // 接收到消息时的回调函数
  var onReceiveMessage = function (event) {
    try {
      var message;
      if (device.platform == "Android") {
        message = window.plugins.jPushPlugin.receiveMessage.message;
      } else {
        message = event.content;
      }
      //$scope.message = message;
      //$scope.messageResult = message;
      //alert($scope.message+"接受消息");
      try{
        //var ret = JSON.parse($scope.message);
        var ret = JSON.parse(message);
      }catch (e){
        alert("解析失败");
      }
      if(ret.type=="chowner"){//这个是转卡的类型，转卡就不用跳转页面

      }else if(ret.type=="loginNotification"){
        $.cookie('token', null);
        $.cookie('organizationPartyId', null);
          $ionicPopup.confirm({
            title:"下线通知",
            template:"你的帐号于" + ret.time + "在一台"+ ret.deviceType + "设备登陆。",
            okText:"退出",
            cancelText:"重新登录"
          })
            .then(function(res){
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
                      $state.go("login");//跳转到登录页面
                    }
                  });
                $state.go("login");//跳转到登录页面
            })
      }else{
        $state.go("tab.paymentSuccess",{
          "type":ret.type,
          "cardId":ret.cardId,
          "amount":ret.amount,
          "cardBalance":ret.cardBalance,
          "storeName":ret.storeName
      });

      }


    } catch (exception) {
      console.log("JPushPlugin:onReceiveMessage-->" + exception);
    }
  };


  // 获取RegistrationID
  var getRegistrationID = function () {
    window.plugins.jPushPlugin.getRegistrationID(function (data) {
      try {
        console.log("JPushPlugin:registrationID is " + data);

        if (data.length == 0) {
          var t1 = window.setTimeout(getRegistrationID, 1000);
        }else{
          //调用极光推送的接口
          //alert(data+"ssss"+device.platform);
          //将极光的registrationID放入到cookie
          $.cookie("registrationID",data,{
            expires:7
          });
          $.cookie("platform",device.platform,{
            expires:7
          });

        }
        //$scope.message += "JPushPlugin:registrationID is " + data;
        //$scope.registrationID = data;
      } catch (exception) {
        console.log(exception);
      }
    });

  };
  //初始化jpush
  var initiateUI = function () {
    try {
      window.plugins.jPushPlugin.init();
      getRegistrationID();
      if (device.platform != "Android") {
        window.plugins.jPushPlugin.setDebugModeFromIos();
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
      } else {
        window.plugins.jPushPlugin.setDebugMode(true);
        window.plugins.jPushPlugin.setStatisticsOpen(true);
      }
      //$scope.message += '初始化成功! \r\n';

    } catch (exception) {
      console.log(exception);
    }
  };

  // 添加对回调函数的监听
  document.addEventListener("deviceready", onDeviceReady, false);
  document.addEventListener("jpush.openNotification", onOpenNotification, false);
  document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
  document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
  //极光推送结束
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }



  });



})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,ionicDatePickerProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        $ionicConfigProvider.views.swipeBackEnabled(false); // 防止ios左滑出现白屏
  var datePickerObj = {
    inputDate: new Date(),
    titleLabel: 'Select a Date',
    setLabel: '确定',
    todayLabel: '今天',
    closeLabel: '关闭',
    mondayFirst: false,
    weeksList: ["日", "一", "二", "三", "四", "五", "六"],
    monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    from: new Date(2017, 01, 01),
    to: new Date(2030, 08, 01),
    showTodayButton: true,
    dateFormat: 'yyyy-MM-dd',
    closeOnSelect: false,
    disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: false,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  //百度地图显示我的圈子定位
    .state('tab.circleMap', {
      url: '/circleMap',
      abstract:false,
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-circleMap.html',
          controller: 'circleMapCtrl'
        }
      },
      cache:false,
      params:{
        isCache:true
      }
    })

    //我的圈子的卡展示页面
    .state('tab.myCircleCard', {
      url: '/myCircleCard/:storeId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-myCircleCard.html',
          controller: 'myCircleCardCtrl'
        }
      },
      cache:false,
      params:{
        isCache:true
      }
    })
    //圈子卡的充值
    .state('tab.cirCleCardRecharge', {
      url: '/cirCleCardRecharge/:storeId/:cardId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-cirCleCardRecharge.html',
          controller: 'cirCleCardRechargeCtrl'

        }
      }
    })
    //向商家买卡
    .state('tab.addCircleCard', {
      url: '/addCircleCard/:storeId/:qrCode/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-addCard.html',
          controller: 'addCircleCardCtrl'
        }
      }
    })
    //扫一扫后向商家买卡（这是买店里的卡）
    .state('tab.scanAddCard', {
      url: '/scanAddCard/:storeId/:qrCode',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-scanAddCard.html',
          controller: 'scanAddCardCtrl'
        }
      }
    })

    //从店铺进去购买圈子的卡
    .state('tab.buyCardPay', {
      url: '/buyCardPay/:storeId/:groupOwnerId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-buyCardPay.html',
          controller: 'buyCardPayCtrl'
        }
      }
    })
    //扫一扫后向商家买卡（这是买圈子里的卡）
    .state('tab.scanAddGroupCard', {
      url: '/scanAddGroupCard/:storeId/:qrCode/:groupOwnerId',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-scanAddGroupCard.html',
          controller: 'scanAddGroupCardCtrl'
        }
      }
    })
    //用户选择卡来消费
    .state('tab.chooseCard', {
      url: '/chooseCard/:storeId/:storeName/:cloudCardList/:qrCode/:canBuyGroupCard/:canBuyStoreCard/:groupOwnerId',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-chooseCard.html',
          controller: 'chooseCardCtrl'
        }
      }
    })

      //我的圈子的页面展示
    .state('tab.myCircle', {
      url: '/myCircle/:storeId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-myCircle.html',
          controller: 'myCircleCtrl'
        }
      }
    })
    //根据storeid来查店铺时候有圈子卡和店里的卡
    .state('tab.selectCircleCardAndShopCard', {
      url: '/selectCircleCardAndShopCard/:storeId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-shopCard.html',
          controller: 'selectCircleCardAndShopCardCtrl'
        }
      }
    })
    //购买店里的卡
    .state('tab.buyShopCard', {
      url: '/buyShopCard/:storeId/:isGroupOwner',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-buyShopCardPay.html',
          controller: 'buyShopCardCtrl'
        }
      }
    })

      //店铺的展示页面
    .state('tab.shop', {
      url: '/shop/:storeId/:isGroupOwner',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-shop.html',
          controller: 'shopCtrl'
        }
      }
    })
    //店铺店的充值
    .state('tab.shopRecharge', {
      url: '/shopRecharge/:storeId/:cardId/:isGroupOwner',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-shopRecharge.html',
          controller: 'shopRechargeCtrl'
        }
      }
    })

    //导航去这家店铺
    .state('tab.goShop', {
      url: '/goShop/:longitude/:latitude/:storeId/:isGroupOwner',
      views: {
        'tab-circleMap': {
          templateUrl: 'templates/tab-shopMap.html',
          controller: 'shopMapCtrl'
        }
      }
    })
    //付款码的展示页面
    .state('tab.paymentCode', {
      url: '/paymentCode/:qrCode/:refreshTime',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-paymentCode.html',
          controller: 'paymentCodeCtrl'
        }
      }
    })

    //根据Id查询某张卡
  .state('tab.mycards', {
      url: '/mycards',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-mycard.html',
          controller: 'mycardCtrl'
        }
      },
    cache:false,
    params:{
      isCache:true
    }
    })

    //分账单的页面查询
    .state('tab.subBill', {
      url: '/subBill/:cardId',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-subBill.html',
          controller: 'subBillCtrl'
        }
      }
    })

   //到卡授权的其他页面
  .state('tab.cardinput', {
      url: '/cardinput/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-cardinput.html',
          controller: 'inputCtrl'
        }
      }
    })


    //授权的默认界面
  .state('tab.accredit', {
      url: '/accredit/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-accredit.html',
          controller: 'inputAccreditCtrl'
        }
      }
    })

    //转卡页面的跳转
    .state('tab.sellCard', {
      url: '/sellCard/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-sellCard.html',
          controller: 'inputsellCardCtrl'
        }
      }
    })


      //转卡成功的页面跳转
    .state('tab.sellCardSuccess', {
      url: '/sellCardSuccess/:cardBalance/:cardName/:tel',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-sellCardSuccess.html',
          controller: 'sellCardSuccessCtrl'
        }
      }
    })
//用户授权成功的页面
  .state('tab.cardreturn', {
      url: '/cardreturn/:teleNumber/:amount/:fromDate/:thruDate/:cardName',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-getpower.html',
          controller: 'DashCtrl'
        }
      }
    })
    //默认方式授权成功的页面
  .state('tab.cardreturnsuccess', {
      url: '/cardreturnsuccess/:teleNumber/:amount/:day/:cardName',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-accreditSuccess.html',
          controller: 'DashAccreditCtrl'
        }
      }
    })
//账单的查询列表
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-aboutMe': {
        templateUrl: 'templates/tab-account.html',
        controller: 'CardDetailCtrl'
      }
    },
      cache:false,
      params:{
        isCache:true
      }
  })


//B端收费成功后C端跳转页面
  .state('tab.paymentSuccess', {
    url: '/paymentSuccess/:type/:cardId/:amount/:cardBalance/:storeName',
    cache: false,
    views: {
      'tab-index': {
        templateUrl: 'templates/tab-paymentSuccess.html',
        controller: 'paymentSuccessCtrl'
      }
    }
  })

    //c端扫码消费成功之后的页面跳转
  .state('tab.userPaymentSuccess', {
    url: '/userPaymentSuccess/:storeName/:amount/:cardBalance/:type',
    cache: false,
    views: {
      'tab-index': {
        templateUrl: 'templates/tab-userPaymentSuccess.html',
        controller: 'userPaymentSuccessCtrl'
      }
    }
  })



    //扫一扫支付的页面
    .state('tab.payment', {
      //url: '/payment/:qrCode/:storeName/:storeId/:storeImgUrl/:cardId',
      url: '/payment/:qrCode/:storeName/:storeId/:cardId/:chooseCardStatus',//这是写死的暂时先拿掉，存在转义字符
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-payment.html',
          controller: 'paymentController'
        }
      }
    })
//设置的页面，退出登录
    .state('setting', {
      url: '/setting',
      cache: false,
      templateUrl: 'templates/tab-setting.html',
      controller: 'settingCtrl'
    })

    .state('login', {
      url: '/login',
      cache: false,
      templateUrl: "templates/login.html",
      controller:'LoginCtrl'
    })
    //注册页面的跳转
    .state('toRegister', {
      url: '/toRegister',
      templateUrl: "templates/register.html",
      controller:'LoginCtrl'
    })

//充值页面
    .state('tab.recharge', {
      url: '/recharge/:cardId/:cardBalance/:cardName/:cardCode/:isAuthToOthers/:isAuthToMe',
      cache: false,
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-recharge.html',
          controller: 'rechargeCtrl'
        }
      }
    })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/index');

});
