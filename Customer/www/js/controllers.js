angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  $scope.chatId = $stateParams.chatId;
  $scope.lastText = $stateParams.lastText;
    // alert($scope.chatId+" "+$scope.lastText);
  var token=$.cookie("token");
  // if(token) {
    jQuery('#output').qrcode("http:/'./jetienne.com?==" + $stateParams.chatId);
  // }else{
  //   location.href="http://"+location.host+"/#/login";
  // }
})


.controller('inputCtrl', function($scope, $stateParams, Chats) {
  // $scope.chat = Chats.get($stateParams.cardId);
   // alert($stateParams.cardId);
   $scope.cardId  =$stateParams.cardId;
   $scope.lastText  =$stateParams.lastText;
  // alert($scope.cardId);
  $("body").off("click").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();
    if ($other_endDate == null | $other_endDate ==''){
        var nowtime = new Date();
        $other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
    }
    $own_cardID=$("#own_cardID").val();
    // alert($other_endDate);
    // alert($scope.name)
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
     var flag =true;
    if (!phoneReg.test($other_tel)) {

          flag = false;
     }
     var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
     if (moneyReg.test($other_money)) {
        if(parseInt(other_money) > parseInt($scope.lastText)){
          alert("授权金额大于可用金额");
          flag = false;
        }
     }else{
          alert("金额输入有误,请重新");
          flag = false;
     }
    if(flag){
        $.post("#/tab/getpowers",
          {'other_tel':$other_tel,
            'cardId':$stateParams.cardId,
            'other_money':$other_money,
            'other_startDate':$other_startDate,
            'other_endDate':$other_endDate,
            'own_cardID':$own_cardID
          },
            function(date){
              if(date.mes=='success'){
                alert("成功");
              }else if(date.mes=='error'){
                alert("失败");
              }else{
                 $other_tel="";
                 $other_money="";
                 $other_startDate="";
                 $other_endDate="";
                 // alert("测试用的，可以删除");
                window.location.href="#/tab/cardreturn"
              }

            }
        );
    }
  });
})


.controller('CardDetailCtrl', function($scope,CardDetail) {
 $scope.cardDetail = CardDetail.all();
 // alert($scope.cardDetail);
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
