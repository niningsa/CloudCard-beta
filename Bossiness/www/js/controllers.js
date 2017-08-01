angular.module('starter.controllers', [])

/*
 * Desc 首页登录判断
 * Author LN
 * Date 2016-11-20
 * */
  .controller('DashCtrl', function ($scope, $state,messageServece,$ionicPopup,myShopDetailService) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }
    myShopDetailService.selectMyShopDetail().success(function (data) {
      console.log(data);
      $scope.ossUrl=data.ossUrl;
      $scope.storeImg=data.storeImg;
      $scope.storeName=data.storeName;
      $scope.storeAddress=data.storeAddress;
    }).error(function (data) {


    });
    messageServece.messageList().success(function (data) {
     console.log(data);
      $scope.messageList=data.partyNotes;
    });
    //消息已读
    $scope.already=function(noteId){
      messageServece.alreadymessageList(noteId).success(function (data) {
        console.log(data);
        //$scope.messageList=data.partyNotes;
        //location.reload();
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "已读成功"
        });
      });
    }
    //查看消息明细
    $scope.viewDetails=function (noteId) {
      messageServece.bizGetNodeDetailed(noteId).success(function (data) {
        //查看明细页面
        $state.go("tab.jiesuanDetailed",{
          "noteDateTime":data.noteDateTime,
          "noteInfo":data.noteInfo
        });
      });
    }
    //删除
    $scope.deleteMessage=function(noteId){
      messageServece.deleteMessageList(noteId).success(function (data) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "删除成功"
        });
        alertPopup.then(function(res) {
          $scope.messageList=data.partyNotes;
          //location.reload();//删除后刷新
        });

      });
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
 * Desc 店家二维码的生成
 * Author WK
 * Date 2017-4-26
 * */
  .controller('shopQrcodeCtrl', function ($scope, $state,applySellerService,$ionicPopup) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }

    //查询店家的二维码，然后生成二维码
    applySellerService.shopQrcode().success(function (data) {
     console.log(data);

      jQuery('#pcode').qrcode(data.storeCode);

    });



  })

  /*
   * Desc 账单列表数据展示
   * Author LN
   * Date 2016-11-20
   * */
  .controller('AccountCtrl', function ($scope, $rootScope, $http, $state, Chats) {
    $scope.items = [
      {text: "0", value: "全部"},
      {text: "1", value: "充值"},
      {text: "2", value: "收款"}
    ];
    $scope.ret = {choice: '0'};

    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");

    var charts = Chats.all(0);                                              // 商家账单
    $scope.Chats = charts;
    $scope.Chatss = charts;
    // console.table($scope.Chatss);

    if (token == '') {
      $state.go("login");
    }
    // 商家授信额度查询
    $http({
      method: "POST",
      url: $rootScope.interfaceUrl + "getLimitAndPresellInfo",
      data: {
        "token": token,
        "organizationPartyId": organizationPartyId
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},      // 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
      transformRequest: function (obj) {                                   // 参数是对象的话，需要把参数转成序列化的形式
        var str = [];
        for (var p in obj) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).success(function (result) {

      $scope.presellAmount = result.presellAmount;                          //	总共卖卡金额
      $scope.limitAmount = result.limitAmount;                              //	卖卡限额
      $scope.balance = result.balance;                                      //	卖卡余额
      $scope.settlementAmount = result.settlementAmount;                    //	跨店消费待结算金额
      $scope.liabilities = result.liabilities;                              //	负债金额（卖出去还未消费的卡总额）
    });

    //下拉刷新操作
    $scope.doRefresh = function () {
      $scope.ret = {choice: '0'};                                           //刷新的同时，将下拉变为全部

      var charts = Chats.all(0);                                           // 商家账单
      $scope.Chats = charts;

      $http({
        method: "POST",
        url: $rootScope.interfaceUrl + "getLimitAndPresellInfo",
        data: {
          "token": token,
          "organizationPartyId": organizationPartyId
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},    // 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
        transformRequest: function (obj) {                                 // 参数是对象的话，需要把参数转成序列化的形式
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).success(function (result) {

        $scope.presellAmount = result.presellAmount;                          //	总共卖卡金额
        $scope.limitAmount = result.limitAmount;                              //	卖卡限额
        $scope.balance = result.balance;                                      //	卖卡余额
        $scope.settlementAmount = result.settlementAmount;                    //	跨店消费待结算金额
        $scope.liabilities = result.liabilities;                              //	负债金额（卖出去还未消费的卡总额）
      });

      $scope.$broadcast("scroll.refreshComplete");
    };


    //下拉列表分类显示
    $scope.change = function (amountType) {
      if ("0" == amountType) {
        $scope.Chats = Chats.all(amountType);
      } else {
        $scope.Chats = _.filter($scope.Chatss, function (o) {               //提高效率（从缓存中过滤数据，不用请求后台，好屌）
          return o.type == amountType;
        });
      }
    }

  })


  /*
   * Desc 消费扫卡
   * Author LN
   * Date 2016-11-20
   * */
  .controller("XiaofeExampleController", function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicLoading, $timeout) {
    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");

    if (token == null) {
      $state.go("login");
    }

    $scope.scanBarcode = function (amount) {
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
          // 扫码支付
          $ionicLoading.show({
            template: "正在调摄像头,请稍后...."
          });
          $timeout(function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
              $ionicLoading.hide();
              $scope.msg = "";                                                //清空错误提示
              var cardCode = imageData.text;

              // alert(cardCode+" "+token+" "+organizationPartyId);
              if (cardCode != '') {
                // alert(cardCode+" "+token+" "+organizationPartyId);
                $.ajax({
                  url: $rootScope.interfaceUrl + "cloudCardWithdraw",
                  type: "POST",
                  data: {
                    "cardCode": cardCode,
                    "token": token,
                    "organizationPartyId": organizationPartyId,
                    "amount": amount
                  },
                  success: function (result) {
                    // alert(result.code+" "+result.msg+"　"+result.amount+" "+result.cardBalance);
                    if (result.code == '200') {
                      $state.go("tab.returnMess", {
                        cardCode: cardCode,
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

            }, function (error) {
              console.log("An error happened -> " + error);
            });

          }, 1000);
        }
      }
    };

  })



  //消费扫卡成功后，页面初始化
  .controller('returnMessCtrl', function ($scope, $stateParams) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;
  })







  /*
   * Desc 充值
   * Author LN
   * Date 2016-11-19
   * */
  .controller('RechargeCtrl', function ($scope, $state, $stateParams, $rootScope, $ionicLoading, $timeout) {
    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");
    if (token == null) {
      $state.go("login");
    }

    //页面信息初始化
    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    //单选按钮初始化
    $scope.items = ['100', '200', '300', '500'];
    $scope.ret = {choice: '100'};

    $scope.recharge = function (money, cardCode, cardName, cardBalance) {
      // alert(cardCode+" "+token+" "+organizationPartyId);
      $ionicLoading.show({
        template: "金额充值中,请稍后...."
      });

      $scope.sub = true;
      $timeout(function () {
        $.ajax({
          url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
          type: "POST",
          data: {
            "cardCode": cardCode,
            "token": token,
            "organizationPartyId": organizationPartyId,
            "amount": money
          },
          success: function (result) {
            // alert(result.code+" "+result.msg+" "+parseFloat(money)+parseFloat(cardBalance) +" "+result.token);

            if (result.code == '200') {
              $ionicLoading.hide();
              $state.go("tab.returnChongZhiMess", {
                cardCode: cardCode,
                cardName: cardName,
                money: money,
                amount: parseFloat(money) + parseFloat(cardBalance)
              });
            } else {
              $scope.$apply(function () {
                $scope.msg = result.msg;
                $scope.sub = false;
                $ionicLoading.hide();
              });
            }
          }
        });
      }, 0);
    }
  })

  //充值成功后，页面初始化
  .controller('returnChongZhiMessCtrl', function ($scope, $stateParams) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.money = $stateParams.money;
    $scope.amount = $stateParams.amount;
  })


  /*
   * Desc 开卡
   * Author LN
   * Date 2016-11-19
   * */
  .controller('ActivateCtrl', function ($scope, $state, $stateParams, $rootScope, $ionicLoading, $timeout) {
    var token = $.cookie("token");
    var organizationPartyId = $.cookie("organizationPartyId");
    if (token == null) {
      $state.go("login");
    }

    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    $scope.items = ['100', '200', '300', '500'];
    $scope.ret = {choice: '100'};

    $scope.activate = function (money, cardCode, kaInputPhone, cardName) {
      //验证手机号码
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if (!phoneReg.test(kaInputPhone)) {
        $scope.msg = "请输入正确的电话号码！";
      } else {

        $ionicLoading.show({
          template: "开卡中,请稍后...."
        });
        // 提交开卡请求
        $scope.sub = true;

        $timeout(function () {

          $.ajax({
            url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
            type: "POST",
            data: {
              "cardCode": cardCode,
              "token": token,
              "organizationPartyId": organizationPartyId,
              "amount": money,
              "teleNumber": kaInputPhone
            },
            success: function (result) {
              // alert(result.code+" "+result.msg);

              if (result.code == '200') {
                // alert("开卡成功！"+cardCode+",充值金额为："+parseFloat(money));

                $ionicLoading.hide();
                $state.go("tab.kaika", {
                  cardCode: cardCode,
                  cardName: cardName,
                  money: money,
                  kaInputPhone: kaInputPhone
                });
              } else {
                $scope.sub = false;
                $ionicLoading.hide();
                $scope.$apply(function () {
                  $scope.msg = result.msg;
                });
              }
            }
          });
        }, 0);
      }

      // alert(cardCode+" "+token+" "+organizationPartyId);
    }
  })

  //开卡成功后，页面初始化
  .controller('kaikaCtrl', function ($scope, $stateParams) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.money = $stateParams.money;
    $scope.kaInputPhone = $stateParams.kaInputPhone;
  })


  /*
   * Desc 获取验证码
   * Author LN
   * Date 2016-11-15
   * */
  .controller('loginCtrl', function ($scope, $interval, $rootScope, $http, $state, $stateParams, $ionicPopup) {
    $scope.telNum = $stateParams.tel;         // 此用于申请商家后 跳转到此 号码自动填充
    $scope.$on('$ionicView.beforeEnter', function () {                              // 这个玩意儿不错，刚加载执行的广播通知方法
      $scope.user = {"identifyCode": ""};                                           // 退出登录后，清空验证码
      if ($.cookie("token") != null || $.cookie("organizationPartyId") != null) {   // 登录成功了，按物理返回键，就别想重新登录
        $state.go("tab.dash");
      }
    });

    $scope.codeBtn = '获取验证码';
    $scope.getIdentifyCode = function (tel) {
      $ionicPopup.confirm({
        title: "提示",
        template: "<p align='center' style='font-size: 12px'>验证码将发送到"+tel+"</p>",
        cancelText: "取消",
        okText: "确定"
      }).then(function (res) {
        if(res){
          $scope.msg = "";//先清空错误提示
          if (tel) {
            $http({
              method: "POST",
              url: $rootScope.interfaceUrl + "getLoginCaptcha",
              data: {
                "teleNumber": tel
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
              console.log(result.code + " " + result.msg);
              if (result.code == '500') {
                $scope.msg = result.msg;
              } else {
                //倒计时
                $scope.n = 60;
                $scope.codeBtn = "获取中 " + $scope.n + " 秒";
                var time = $interval(function () {
                  if ($scope.n <= 0) {
                    $interval.cancel(time); // 取消定时任务
                    $scope.codeBtn = '获取验证码';
                    $scope.codeBtnDisable = false;
                  }else{
                    $scope.n--;
                    $scope.codeBtn = "获取中 " + $scope.n + " 秒";
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
   * Desc 登录
   * Author LN
   * Date 2016-11-15
   * */
  .controller('login', function ($cordovaDevice, $scope, $state, $rootScope) {
    // 当设备就绪时
    var onDeviceReady = function () {
      initiateUI();
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
      } catch (exception) {
        console.log(exception);
      }
    };



    // 获取RegistrationID
    var getRegistrationID = function () {
      window.plugins.jPushPlugin.getRegistrationID(function (data) {
        try {
          if (data.length == 0) {
            window.setTimeout(getRegistrationID, 1000);
          } else {
            var token = $.cookie("token");
            // alert(device.platform+" "+data+" "+token);

            // 极光推送设备注册
            $.ajax({
              url: $rootScope.interfaceUrl + "regJpushRegId",
              type: "POST",
              data: {
                "token": token,
                "regId": data,
                "deviceType": device.platform,
                "appType": "biz"
              },
              success: function (result) {
                // alert(result.code+" "+result.msg);
                $.cookie("registrationId", data, {
                  expires: 7
                });
                // alert($.cookie("registrationId"));
                // 设置别名和标签
                // alert($.cookie("organizationPartyId"));
                $scope.formData = {};
                $scope.formData.tags1 = $.cookie("organizationPartyId");
                try {
                  var tags = [];
                  tags.push($scope.formData.tags1);

                  window.plugins.jPushPlugin.setTagsWithAlias(tags, $scope.formData.alias);
                  document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
                } catch (exception) {
                  console.log(exception);
                }
              }
            });
          }

        } catch (exception) {
          alert(exception);
        }
      });
    };

    // 设置标签和别名
    var onTagsWithAlias = function (event) {
      try {
        $scope.message += "onTagsWithAlias";
        var result = "result code:" + event.resultCode + " ";
        result += "tags:" + event.tags + " ";
        result += "alias:" + event.alias + " ";
        $scope.message += result;
        $scope.tagAliasResult = result;
        // alert(result);
      } catch (exception) {
        console.log(exception)
      }
    };

    $scope.cloudCardLogin = function () {
      var uuid = "5438543854384385202501314438";
        //$cordovaDevice.getUUID();
      $.ajax({
        url: $rootScope.interfaceUrl + "bizAppLogin",
        type: "POST",
        data: {
          "teleNumber": $scope.user.tel,
          "captcha": $scope.user.identifyCode,
          "deviceId":uuid
        },
        success: function (result) {
          console.log(result);
          if (result.code == '200') {
            $scope.$apply(function () {
              $scope.msg = "";
            });
            //将 token 和 organizationPartyId 存入cookie 过期时间7天
            $.cookie("token", result.token, {
              expires: 7
            });
            $.cookie("organizationPartyId", result.organizationPartyId, {
              expires: 7
            });

            // 添加对回调函数的监听
            document.addEventListener("deviceready", onDeviceReady, false);
            $state.go("tab.dash");

          } else {
            $scope.$apply(function () {
              $scope.msg = result.msg;
            });
          }
        }
      });
    };
  })

  /*
   * Desc 退出
   * Author LN
   * Date 2016-11-21
   * */
  .controller('settingCtrl', function ($scope, $state, $ionicPopup, $rootScope) {
    if ($.cookie("token") == null || $.cookie("organizationPartyId") == null) {
      $state.go("login");
    }

    //获取app版本
    cordova.getAppVersion.getVersionNumber().then(function(version){
      $scope.appVersion = version;
    })

    //退出登录
    $scope.exitLogin = function () {
      $ionicPopup.confirm({
        title: "退出",
        template: "是否要退出登录?",
        cancelText: "取消",
        okText: "确定"
      }).then(function (res) {
        if (res) {

          var token = $.cookie("token");
          var registrationId = $.cookie("registrationId");
          // // 极光推送删除设备ID
          if (token != null && registrationId != null) {
            // alert(token+" "+registrationId);
            $.ajax({
              url: $rootScope.interfaceUrl + "removeJpushRegId",
              type: "POST",
              data: {
                "token": token,
                "regId": registrationId
              },
              success: function (result) {
                // alert(result.code+" "+result.msg);
              }
            });
          }

          $.cookie("token", null);
          $.cookie("organizationPartyId", null);
          $.cookie("registrationId", null);

          // 设置别名和标签
          $scope.formData = {};
          $scope.formData.tags1 = 'overTags';
          try {
            var tags = [];
            tags.push($scope.formData.tags1);

            window.plugins.jPushPlugin.setTagsWithAlias(tags, $scope.formData.alias);
            // alert("设置别名OK！");
          } catch (exception) {
            // alert("设置别名错误！");
            console.log(exception);
          }
          $state.go("login");
        }
      });
    }

  })


  .controller('applySellerCtrl', function ($scope) {
    var longitude = localStorage.getItem('longitude');
    var latitude = localStorage.getItem('latitude');
    var po=new BMap.Point(longitude,latitude);
    //创建一个地理解析器
    var geocoder=new BMap.Geocoder();
    //获取位置
    geocoder.getLocation(po,function(rs){
      //获取地理组件
      var addComp=rs.addressComponents;
      //获取省份
      var province=addComp.province;
      //获取城市
      var city=addComp.city;
      //获取区县
      var district=addComp.district;
      //获取街道
      var street=addComp.street;
      //获取街道号
      var streetNumber=addComp.streetNumber;
      //地址
      $scope.businessAddr = province+city+district+street+streetNumber;//将获取到的信息输出到页面
    });
  })

  /*
   * Desc 申请商家
   * Author LN
   * Date 2017-2-26
   * */
  .controller("registerCtrl", function ($scope, $ionicLoading, $ionicPopup, $state, Banks, applySellerService, $rootScope, $http, $interval) {
    $scope.applySeller = function () {
      //验证手机号码
      var flag = true;
      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (!phoneReg.test($scope.phone)) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "手机号码不正确!!",
          okText: "确定",
        })
        flag = false;
      }
      if(flag){
        $scope.codeBtnDisable = false;//防止二次点击
        applySellerService.applySellerRegister(
          $scope.businessName,
          $scope.phone,
          $scope.businessAddr,
          $scope.identifyCode
        ).success(function (data) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '成功提示',
            template: '恭喜您开店成功！'
          });
          alertPopup.then(function (res) {
            //用户点击确认登录后跳转
            $state.go("login", {
              "tel": $scope.boss.phone
            });
          })

        }).error(function (data) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '开店失败',
            template: data
          });
        });
      }
    };

    $scope.codeBtn = '获取验证码';
    $scope.getCreateStoreCode = function (tel) {
      $ionicPopup.confirm({
        title: "提示",
        template: "<p align='center' style='font-size: 12px'>验证码将发送到"+tel+"</p>",
        cancelText: "取消",
        okText: "确定"
      }).then(function (res) {
        if(res) {
          $scope.msg = "";//先清空错误提示
          $scope.codeBtnDisable = false;//防止二次点击
          if (tel) {
            $http({
              method: "POST",
              url: $rootScope.interfaceUrl + "getCreateStoreCaptcha",
              data: {
                "teleNumber": tel,
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
    }
  })












