angular.module('starter.controllers', [])

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


  //分账单的页面查询

  .controller('subBillCtrl', function($scope, CardDetail,$state,$rootScope,$stateParams) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardDetail= CardDetail.get($scope.cardId);
    $scope.items=[
      {text:"0",value:"全部"},
      {text:"1",value:"充值"},
      {text:"2",value:"消费"}
    ];
    //默认选择全部
    $scope.ret={choice:'0'};

    $scope.cardDetails = CardDetail.get($scope.cardId);
    $scope.cardDetail = $scope.cardDetails;

    //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.get($scope.cardId);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

    };

    //下拉列表分类显示，查询全部是请求后台，按照类型去查询的时候就使用_.filter在查询出来的数据进行过滤
    $scope.change = function(amountType){
      //第一次查询全部的时候调用后台去查询一下
      if("0" == amountType){
        $scope.cardDetail = $scope.cardDetails;
      }else{
        //-.filter  lodash实现过滤，利用第一次查询的数据第二次做筛选
        $scope.cardDetail =  _.filter($scope.cardDetails, function(o){  //提高效率（从缓存中过滤数据，不用请求后台，好屌）
          return o.type==amountType;
        });
      }

    }
  })


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $state, $ionicPopup, $rootScope, $ionicModal) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;
    //alert($scope.lastText);
  //$scope.chat = Chats.get($stateParams.chatId);
  //  console.table($scope.chat );
  // alert(jQuery('#output'));
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
.controller('inputCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
   $scope.cardId  =$stateParams.cardId;
   $scope.cardBalance  =$stateParams.cardBalance;
   $scope.cardName  =$stateParams.cardName;
   $scope.cardCode  =$stateParams.cardCode;
   $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
   $scope.isAuthToMe  =$stateParams.isAuthToMe;
    var token=$.cookie("token");



  $("body").off("click", "#powerfrom").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_cardId=$("#other_cardId").val();
    //$other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();

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

    if ($other_endDate == null | $other_endDate ==''){
      $ionicPopup.alert({
        title:"温馨提示",
        template:"请将时间填写完整",
        okText:"确定",
      })
      //var nowtime = new Date();
      //$other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
      flag = false;
    }
    if ($other_startDate == null | $other_startDate ==''){
      //var nowtime2 = new Date();
      //$other_endDate = nowtime2.toLocaleDateString().replace('/','-').replace('/','-');
      $ionicPopup.alert({
        title:"温馨提示",
        template:"请将时间填写完整",
        okText:"确定",
      })
      flag = false;
    }
    if($other_startDate > $other_endDate ){
      $ionicPopup.alert({
        title:"温馨提示",
        template:"截止时间应大于授权时间",
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
          //"amount":$other_money,
          "fromDate":$other_startDate,
          "thruDate":$other_endDate
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
            //授权成功，传入必要的参数，跳转到授权成功的查看页面
            window.location.href="#/tab/cardreturn/"+$other_tel+"/"+$scope.cardBalance+"/"+$other_startDate+"/"+$other_endDate+"/"+$scope.cardName;
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


  //转卡页面的传值
  .controller('inputsellCardCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode = $stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

    $scope.sellCard=function(cardName,cardBalance){
      var tel=$("#telphone").val();
      var flag =true;
      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test(tel)) {
        $scope.msg = '手机号码输入有误，请重新输入！！';
        //$("#telphone").val(" ");
        flag = false;
      }

      if(flag){
        $state.go("tab.sellCardSuccess",{
          "cardBalance":cardBalance,
          "cardName":cardName,
          "tel":tel
        });
      }

    }
  })
  //授权的默认界面

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
      $other_tel=$("#other_tel").val();
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

  //账单信息
.controller('CardDetailCtrl', function($scope,CardDetail,$rootScope) {

  // $(".item-content.disable-pointer-events").css("padding-right","40px");

  $scope.items=[
    {text:"0",value:"全部"},
    {text:"1",value:"充值"},
    {text:"2",value:"消费"}
  ];
  //默认选择全部
  $scope.ret={choice:'0'};


  //$("#amountType").val(0);

  $scope.cardDetails = CardDetail.all(0);
  $scope.cardDetail = $scope.cardDetails;

  //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.all(0);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

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
    if("0" == amountType){
      $scope.cardDetail = $scope.cardDetails;
    }else{
      //-.filter  lodash实现过滤，利用第一次查询的数据第二次做筛选
      $scope.cardDetail =  _.filter($scope.cardDetails, function(o){  //提高效率（从缓存中过滤数据，不用请求后台，好屌）
        return o.type==amountType;
      });
    }

  }

  })




//退出登录
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








//获取验证码
.controller('LoginCtrl', function($scope,$interval,$rootScope,$http,$state) {
  // $scope.tel='15910989807';
  //$scope.user={
  //  tel:"18702104254"
  //};
  //为了让安卓手机按返回时不跳到登陆页面，判断tooken
  $scope.$on('$ionicView.beforeEnter', function () {                           // 这个玩意儿不错，刚加载执行的广播通知方法
    $scope.user = {"identifyCode": ""};                                          // 退出登录后，清空验证码
    if ($.cookie("token") != null) { // 登录成功了，按物理返回键，就别想重新登录
      $state.go("tab.chats");
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

 //登录
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
            $state.go("tab.chats");
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



//扫码消费
  .controller("scanPaymentController", function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicPopup, $ionicLoading, $timeout,$stateParams) {
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
                          cardId: $scope.cardId
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

      },1000);
    };
  })


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
    $scope.storeImgUrl = $stateParams.storeImgUrl;
    $scope.cardId = $stateParams.cardId;

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
  .controller('rechargeCtrl', function ($scope, $stateParams) {
    //页面信息初始化
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

    //单选按钮初始化
    $scope.ret = {choice: '100'};

    $scope.alipay=function (choice) {
      alert("支付宝支付。。。"+choice);
      var myDate = new Date();
      var tradeNo = myDate.getTime();

      var alipayClass = navigator.alipay;
      var rsa ="MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAN2G9VHLDQyeogKbaHSPf89a9u8symYSKM1ucaGlGRf0vUxO2SWn0YCFF0Z3c1cx0kISQRtzH2r1vb0FGsEwoQuEXq0FCEbbxQ1/E/ehTX0wPxrfADz5pVWvWzehQT7DS/IWbsSQOnUxMHKcN2Q3Uy3R02JrErSaJMj5gxCq1B/bAgMBAAECgYAQV9uTbDqLOszTCmobZ1bTkm9zV8ea3i4acdJ6TXbbeJfaoFqO16GyLJ95+GgO/8L2UuhwwP6JYpXb8xt1M0Q+NSK6b/QZLCEla+7qXoeEHJ2SAe56doK+QL34sI74inGHuYXFogT/vZN78f+f6wX6XQfS7OvTuicL66T7tabx0QJBAPEkexGhnxiuyt66kGp/LvuPe1rFtYv6zFt8qVL7lQ+YioU0AAHz9cfI4OvzoIG2Y0qy4p2d6T90dWzNh/PSvTMCQQDrLRY5KDlNULzgm/6sMi7ao7rdGfIQku85s5fBWDBuSH7BYqD8emYSjyVixc6wKhY98aSq14G0qHx+hju/tQK5AkEAiEQfL4VvTBlqFpbCiQu51vnrsQ3MW3+r/37giD4Wq6t9i2wpHPFpUC5Zu7v+VY5laY7QtFTJu8vpl0RFsSjDNQJAbYxTDczu5FT3pqkDuLKnoLEkGlo7p/zJ8tb1mdq6tKSQZwTKeNGLOpnzkE8UOHtiYPhu/CXnBYB2fXmJ24M2AQJALqxMOoK5m8ycrQr6onx3Q5TFsTvGoRX+SVtDzh2ON5J3MfL2FqnFx1bpNOtsMGKgP2/hgU1H47U9eywxXNHviA==";
      var pubRsa="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB";
      alipayClass.pay({
        "partner":"2088422692929955",       //商户ID
        "rsa_private":rsa,                  //私钥
        "rsa_public":pubRsa,                //公钥
        "seller":"2088422692929955",        //收款支付宝账号或对应的支付宝唯一用户号
        "subject":"共享停车",               //商品名称
        "body":"共享停车支付宝支付",         //商品详情
        "price":"0.01",                     //金额
        "tradeNo":tradeNo,
        "timeout":"30m",                    //超时设置
        "notifyUrl":"http://www.baidu.com"
      },function(resultStatus){
        $ionicLoading.show({
          template:"支付宝支付成功返回结果＝" + resultStatus,
          noBackdrop: true,
          duration: 500
        });


      },function(message){
        $ionicLoading.show({
          template:"支付宝支付失败＝" + message,
          noBackdrop: true,
          duration: 500
        });
      });
    };

    $scope.weiXin=function (choice) {
      alert("微信支付。。。"+choice);
      $.ajax({
        url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/wxPrepayOrder",
        type:"POST",
        data: {
          "body":"chongzhi",
          "totalFee":"1",
          "tradeType":"APP"
        },
        success: function(result){
          console.log(result);
          var jsonwx = {
            appid: result.appid,
            noncestr: result.noncestr,
            package: result.package,
            partnerid: result.partnerid,
            prepayid: result.prepayid,
            sign: result.sign,
            timestamp: result.timestamp
          };

          wxpay.payment(jsonwx, function (msg) {
            if (msg) {
              alert('微信支付成功');
            }
          }, function (error) {
            alert("支付失败");
          });
        }
      });



    };

  })

;

