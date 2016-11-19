angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  // alert(window.innerHeight);
  // alert($("#zkmoney").html());
  $("#zkmoney").height(window.innerHeight*0.6);
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
   $scope.nginputMoney = $stateParams.nginputMoney;
})

.controller('AccountCtrl', function($scope,Chats) {
  var charts = Chats.all();
  $scope.Chats = charts;

})



  // $("body").on("change","#account_type", function() {
  //  var $account_type = $("#account_type").val();//得到选择的类型
  //  alert($account_type);
  //   if ($account_type == 'all' ) {//选择不同的类型
  //     charts = Chats.all();
  //   }else {
  //      $scope.Chats = Chats.select($account_type);
  //   }
  //   alert($scope.Chats);
  //   $.post("#/tab/returnMess",
  //     {},
  //     function(date){
  //       if(date.mes=='success'){
  //         alert("成功");
  //       }else if(date.mes=='error'){
  //         alert("失败");
  //       }else{
  //         alert("选择消费类型，到后台查数据");
  //           // $scope.chats = '123456';
  //         // window.location.href="#/tab/returnMess/" + nginputMoney;
  //       }
  //     });
  //   });


// .controller('accountTypeController', function($scope,$stateParams) {
//    $scope.expression =function(){};
//    alert("aaa");

// })
.controller('TestCtrl', function($scope){
  $scope.change = function(x){
    console.log(x);
  }
})



.controller('returnMessCtrl', function($scope,$stateParams) {
   $scope.moneyinfo =$stateParams.nginputMoney;
})

.controller('returnChongZhiMessCtrl', function($scope,$stateParams) {
  // alert("returnChongZhiMessCtrl");
   $scope.nginputMoney =$stateParams.nginputMoney;
})


.controller('xiaofeCtrl', function($scope,$stateParams) {
  // alert("aa");
   $scope.imageData = $stateParams.imageData;
})

.controller('RechargeCtrl', function($scope,$stateParams) {
  // alert("RechargeCtrl");
   $scope.imageData = $stateParams.imageData;
})

.controller('ActivateCtrl', function($scope,$stateParams) {
  // alert("ActivateCtrl");
   $scope.imageData = $stateParams.imageData;
    nginputMoney = $scope.kaInputMoney;
})

.controller('kaikaCtrl', function($scope,$stateParams) {
  // alert("kaikaCtrl");
   $scope.money = $stateParams.money;
   $scope.phone = $stateParams.phone;
})


.controller("kakaController", function($scope, $cordovaBarcodeScanner) {
    $scope.kaika = function() {


     var  kaInputPhone=$("#kaInputPhone").val();
      var kaInputMoney=$("#kaInputMoney").val();

      var flag = true;
      //验证金额
     var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
     if (!moneyReg.test(kaInputMoney)) {
      alert("金额输入有误,请重新");
      flag = false;
      };

      //验证电话号码
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if (!phoneReg.test(kaInputPhone)) {
        alert("号码有误");
        flag = false;
      };
      if(flag){
       //请求到后台
       $.post('#/tab/ceshidizhi',{},function(date){
          //将input类容清空
          $("#kaInputPhone").val("");
          $("#kaInputMoney").val("");
          window.location.href="#/tab/kaika/" + kaInputPhone + "/" + kaInputMoney;

       })
     }
    }
  })


//消费扫卡
.controller("XiaofeExampleController", function($scope, $cordovaBarcodeScanner) {
    $scope.scanBarcode = function() {

          //用于点击确定按钮跳转
            $("body").off("click").on("click","#xiaofefrom", function() {

              //判断输入金额格式对不对
                flag = true;
                nginputMoney = $scope.xiaoinputMoney;
                var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
                 if (!moneyReg.test(nginputMoney)) {
                      alert("消费金额输入有误,请重新");
                      flag = false;
                 };
              $cordovaBarcodeScanner.scan().then(function(imageData) {
                alert(imageData.text);
                alert("收费");
               if(imageData.text!=null && imageData.text!=''){//判断有没有读取到数据
                    if(flag){//金额格式不对不能提交数据
                    $.post("#/tab/returnMess",
                      {},
                      function(date){
                        if(date.mes=='success'){
                          alert("成功");
                        }else if(date.mes=='error'){
                          alert("失败");
                        }else{
                           // alert("提交金额，到后台查数据");
                          window.location.href="#/tab/returnMess/" + nginputMoney;
                        }
                    })
                  }
                }
              }, function(error) {
              console.log("An error happened -> " + error);
              });


              // alert("跳过");
             });
    };
})


.controller("KaiKaController", function($scope, $cordovaBarcodeScanner) {
  $scope.scanBarcode = function() {
          //用于点击确定按钮跳转
          flag = true;
              //判断输入金额格式对不对
              nginputMoney = $scope.inputMoney;

              var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
              if (!moneyReg.test(nginputMoney)) {
                alert("开卡金额输入有误,请重新");
                flag = false;
              };

              if(flag){//金额格式不对不能提交数据
                $.post("#/tab/test",
                  {},
                  function(date){
                    if(date.mes=='success'){
                      alert("成功");
                    }else if(date.mes=='error'){
                      alert("失败");
                    }else{
                      // alert("提交金额，到后台查数据");
                      window.location.href="#/tab/returnChongZhiMess/" + nginputMoney;
                    }
                  })
              }
  };
})


.controller("RechargeExampleController", function($scope, $cordovaBarcodeScanner) {
    $scope.scanBarcode = function() {
       $cordovaBarcodeScanner.scan().then(function(imageData) {

        // alert(imageData.text + "扫到的数据");
        //扫二维码得到卡ID到数据查判断是开卡还是充值
        //判断有没有扫到数据

        alert(122112);
        if(imageData.text!=null && imageData.text!=''){//判断有没有读取到数据

          url = "#/tab/returnMess";
            $.post(
                url,
                // {"imageData",imageData},
                function(date){
                  if(date.mes=='success'){
                  alert("成功");
                  }else if(date.mes=='error'){
                    alert("失败");
                  }else{
                     // alert("扫二维码,到后台查数据");
                    var chage = "kaka";//模拟充值业务
                    if (chage == 'kaka') {
                        var CardID = 1;//模拟数据
                        window.location.href="#/tab/recharge/" + CardID;
                    }else if(chage == 'zhongzhi'){
                        var CardID = 1;//模拟数据
                        // alert("activate");
                        window.location.href="#/tab/activate/" + CardID;
                    }


                  }
                }
              )
        }


        //用于点击确定按钮跳转
        //  $("body").off("click").on("click","#xiaofefrom", function() {
        //   flag = true;
        //   //判断输入金额格式对不对
        //   nginputMoney = $scope.inputMoney;
        //   var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
        //    if (!moneyReg.test(nginputMoney)) {
        //         alert("消费金额输入有误,请重新");
        //         flag = false;
        //    };
        //   if(flag){//金额格式不对不能提交数据
        //     $.post("#/tab/returnMess",
        //       {},
        //       function(date){
        //         if(date.mes=='success'){
        //           alert("成功");
        //         }else if(date.mes=='error'){
        //           alert("失败");
        //         }else{
        //           // alert("提交金额，到后台查数据");
        //           window.location.href="#/tab/returnMess/" + nginputMoney;
        //         }
        //     })
        //   }
        //   // alert("跳过");
        // });


      }, function(error) {
      console.log("An error happened -> " + error);
      });

    };
})

//获取验证码
  .controller('LoginCtrl', function($scope,$interval,$rootScope,$http) {
    // $scope.tel='15910989807';
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

  //登录17092363583 284231
  .controller('login', function($scope,$rootScope) {
    $scope.cloudCardLogin=function () {
      console.log($scope.user.tel+" "+$scope.user.identifyCode);
      $.ajax({
        url: $rootScope.interfaceUrl+"bizAppLogin",
        type:"POST",
        data: {
          "teleNumber":$scope.user.tel,
          "captcha":$scope.user.identifyCode
        },
        success: function(result){
          console.log(result);
          if(result.code=='200'){
            $scope.$apply(function () {
              $scope.msg="";
            });
            //将 token 和 organizationPartyId 存入cookie 过期时间7天
            $.cookie("token",result.token,{
              expires:7
            });
            $.cookie("organizationPartyId",result.organizationPartyId,{
              expires:7
            });

            location.href="http://"+location.host+"/#/tab/dash";
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
