angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$stateParams) {

    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.fromDate = $stateParams.fromDate;
    $scope.thruDate = $stateParams.thruDate;
  })

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
    $scope.doRefresh = function() {
      $scope.chats = Chats.all();
      $scope.$broadcast("scroll.refreshComplete");
    };
    //alert( $scope.chats[0].lastText);
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
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
    if($stateParams.isAuthToOthers=='N' & $scope.isAuthToMe=='N'){
      jQuery('#sq').html('你可以<a href="#/tab/cardinput/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'">授权</a>给你好友！');
    }else{
      jQuery('#sq').html('该卡已被授权');

    }

  //  jQuery('#output').qrcode({
  //     render: "table", //table方式
  //     width: 200, //宽度
  //     height:200, //高度
  //     text: "www.helloweba.com" //任意内容
  // });
})


//授权的controller
.controller('inputCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
   $scope.cardId  =$stateParams.cardId;
   $scope.cardBalance  =$stateParams.cardBalance;
   $scope.cardName  =$stateParams.cardName;
   $scope.cardCode  =$stateParams.cardCode;
    var token=$.cookie("token");



  $("body").off("click", "#powerfrom").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_cardId=$("#other_cardId").val();
    $other_money=$("#other_money").val();
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
        //url:"http://192.168.0.109:8080/cloudcard/control/createCardAuth",
        async: false,
        data: {
          //"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbG91ZGNhcmQiLCJkZWxlZ2F0b3JOYW1lIjoiZGVmYXVsdCIsImV4cCI6MTQ4MDA1NTgwMCwidXNlciI6IkNDMTAwMDAiLCJpYXQiOjE0Nzg3NTk4MDB9.razjBCaXNa3rLsS_-kF8YglW4I01VteRClvpC0TbnPs",
         "token":token,
          "cardId":$other_cardId,
          "teleNumber":$other_tel,
          "amount":$other_money,
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
            //alert("授权失败,"+data.msg);
          }
          //跳转到登录的页面
          if(data.code==400){
            $state.go("login");
          }
          if(data.code==200){
            //授权成功，传入必要的参数，跳转到授权成功的查看页面
            window.location.href="#/tab/cardreturn/"+$other_tel+"/"+$other_money+"/"+$other_startDate+"/"+$other_endDate;
          }


          //window.location.href="http://"+location.host+"#/tab/cardreturn/"+$other_tel+"/"+$other_money+"/"+$other_startDate+"/"+$other_endDate;
        },
        error:function (e) {
          console.log(e);

          window.location.href="#/tab/cardinput";
        }
      });


    };
  });
})


.controller('CardDetailCtrl', function($scope,CardDetail,$rootScope) {
  $("#amountType").val(0);
  $scope.cardDetail = CardDetail.all(0);
  //下拉刷新的功能
    $scope.doRefresh = function() {
      $scope.cardDetail = CardDetail.all();
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

    };
  //下拉列表分类显示
  $scope.change = function(amountType){
    console.log(amountType);
    var cardDetail = CardDetail.all(amountType);                                   // 商家账单
    $scope.cardDetail = cardDetail;
  }

  })


  //退出登录
//.controller('loginOutController', function($scope,CardDetail,$rootScope,$state,$ionicPopup) {
//    $scope.loginOut=function(){
//      //退出登录时清除cookie;
//        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
//        if (keys) {
//          for (var i = keys.length; i--;)
//            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
//        }
//      $ionicPopup.confirm({
//        title:"退出",
//        template:"是否退出要退出登录???",
//        okText:"确定",
//        cancelText:"取消"
//      })
//        .then(function(res){
//          if(res){
//            $state.go("login");
//          }
//        })
//
//    }
//
//
//})

//退出登录
  .controller('settingCtrl', function($scope,$state,$ionicPopup) {
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
            $state.go("login");
          }
        })

    }
  })


  //返回首页

.controller('returnController', function($scope,CardDetail,$rootScope,$state) {
    $scope.return=function(){

      $state.go("tab.chats");
    }


})






//获取验证码
.controller('LoginCtrl', function($scope,$interval,$rootScope,$http) {
  // $scope.tel='15910989807';
  //$scope.user={
  //  tel:"18702104254"
  //};
  $scope.codeBtn='获取验证码';

  $scope.getIdentifyCode=function (tel) {
    $scope.msg="";//先清空错误提示
    if(tel){
      /*
      $.ajax({
          url: $rootScope.interfaceUrl+"getLoginCaptcha",
          type:"POST",
          data: {
              "teleNumber":tel
          },
          success: function(result){
              console.log(result.code+" "+result.msg);
              $scope.$apply(function () {
                if(result.code=='500'){
                  $scope.msg=result.msg;
                }else{

                    //倒计时
                    $scope.n=10;
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

          }
      });
      */
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
            $scope.$apply(function () {
              $scope.msg="";
            });
            //将token 存入cookie 过期时间7天
            $.cookie("token",result.token,{
              expires:7
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

;

