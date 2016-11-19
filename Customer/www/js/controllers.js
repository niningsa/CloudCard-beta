angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$stateParams) {

    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.fromDate = $stateParams.fromDate;
    $scope.thruDate = $stateParams.thruDate;
  })

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
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
    //alert($stateParams.chatId);
    //alert($scope.lastText);
  //$scope.chat = Chats.get($stateParams.chatId);
  //  console.table($scope.chat );
  // alert(jQuery('#output'));
  //  将客户的cardCode放入生成的二维码中
   jQuery('#output').qrcode($stateParams.cardCode);

  //  jQuery('#output').qrcode({
  //     render: "table", //table方式
  //     width: 200, //宽度
  //     height:200, //高度
  //     text: "www.helloweba.com" //任意内容
  // });
})


//授权的controller
.controller('inputCtrl', function($scope, $stateParams, Chats) {
   $scope.cardId  =$stateParams.cardId;
   $scope.cardBalance  =$stateParams.cardBalance;
   $scope.cardName  =$stateParams.cardName;

  $("body").off("click").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_cardId=$("#other_cardId").val();
    $other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();
    if ($other_endDate == null | $other_endDate ==''){
        var nowtime = new Date();
        $other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
    }

    //验证手机号是否合法
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
     var flag =false;
    if (!phoneReg.test($other_tel)) {
      alert("请输入正确的手机号码");
          flag = false;
     }

    //正则验证输入金额是否合法 

     var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
     if (moneyReg.test($other_money)) {
        if(parseInt($other_money) > parseInt($scope.cardBalance)){
          alert("授权金额大于可用金额");
          flag = false;
        }
     }else{
          alert("金额输入有误,请重新输入");
          flag = false;
     }
    if(flag){

      $.ajax({
        type: "POST",
        url: "http://192.168.0.107:8080/cloudcard/control/createCardAuth",
        async: false,
        data: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbG91ZGNhcmQiLCJkZWxlZ2F0b3JOYW1lIjoiZGVmYXVsdCIsImV4cCI6MTQ4MDA1NTgwMCwidXNlciI6IkNDMTAwMDAiLCJpYXQiOjE0Nzg3NTk4MDB9.razjBCaXNa3rLsS_-kF8YglW4I01VteRClvpC0TbnPs",
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
          //授权成功，传入必要的参数，跳转到授权成功的查看页面
          window.location.href="#/tab/cardreturn/"+$other_tel+"/"+$other_money+"/"+$other_startDate+"/"+$other_endDate;
        },
        error:function (e) {
          console.log(e);
          window.location.href="#/tab/cardinput";
        }
      });


    };
  });
})


.controller('CardDetailCtrl', function($scope,CardDetail) {
 $scope.cardDetail = CardDetail.all();

})






//获取验证码
.controller('LoginCtrl', function($scope,$interval,$rootScope,$http) {
  // $scope.tel='15910989807';
  $scope.user={
    tel:"18702104254"
  };
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
        console.log(result.code+" "+result.msg);
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
          console.log(result.code+" "+result.msg);
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

