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


  .controller('AccountCtrl', function($scope, $rootScope, $http, Chats) {
    var charts = Chats.all();
    $scope.Chats = charts;
    $http({
        method: "POST",
        url: $rootScope.interfaceUrl+"getLimitAndPresellInfo",
        data: {
           "token": $rootScope.token,
           "organizationPartyId":$rootScope.organizationPartyId,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },   // 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
        transformRequest: function(obj) {                                   // 参数是对象的话，需要把参数转成序列化的形式
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
    }).success(function (result) {
        alert(result.code+" "+result.msg);
        $scope.presellAmount=result.presellAmount;                           //	已卖出金额
        $scope.limitAmount=result.limitAmount;                               //	卖卡限额
        $scope.balance=result.balance;                                       //	卖卡余额
    });
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


  /*
   * Desc 消费扫卡
   * Author LN
   * Date 2016-11-20
   * */
  .controller("XiaofeExampleController", function($scope, $state, $cordovaBarcodeScanner, $rootScope) {
    $scope.scanBarcode = function(amount) {
      //用于点击确定按钮跳转
      $("body").off("click").on("click","#xiaofefrom", function() {

        //判断输入金额格式对不对
        var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
        if (!moneyReg.test(amount)) {
          alert("消费金额输入有误,请重新");
        }else{
          $cordovaBarcodeScanner.scan().then(function(imageData) {
            var cardCode=imageData.text;
            alert(cardCode);

            if(cardCode!='') {
              $.ajax({
                url: $rootScope.interfaceUrl + "cloudCardWithdraw",
                type: "POST",
                data: {
                  "cardCode": cardCode,
                  "token": token,
                  "organizationPartyId": organizationPartyId,
                  "amount":amount
                },
                success: function (result) {
                  alert(result.code+" "+result.msg+"　"+result.amount+" "+result.cardBalance);
                  if(result.code=='200'){
                    $state.go("tab.returnMess",{
                      cardCode:cardCode,
                      amount:amount,
                      cardBalance:result.cardBalance
                    });
                  }
                }
              });
            }

          }, function(error) {
            console.log("An error happened -> " + error);
          });

        }

      });
    };
  })

  //消费扫卡成功后，页面初始化
  .controller('returnMessCtrl', function($scope,$stateParams) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;
  })

  /*
   * Desc 扫二维码得到卡ID到数据查判断是开卡还是充值
   * Author LN
   * Date 2016-11-19
   * */
  .controller("RechargeExampleController", function($scope, $state, $cordovaBarcodeScanner, $rootScope) {

      $scope.scanBarcode = function() {
         $cordovaBarcodeScanner.scan().then(function(imageData) {

          // alert(imageData.text + "扫到的数据");
          var cardCode=imageData.text;
          var token=$.cookie("token");
          var organizationPartyId=$.cookie("organizationPartyId");

          alert(cardCode+" "+token+" "+organizationPartyId);
          if(cardCode!='' && token!='' && organizationPartyId!="") {
            alert("Come in");
            $.ajax({
              url: $rootScope.interfaceUrl + "getCardInfoByCode",
              type: "POST",
              data: {
                "cardCode": cardCode,
                "token": token,
                "organizationPartyId": organizationPartyId
              },
              success: function (result) {
                  alert(result.isActivated+" "+result.cardName+" "+result.cardId+" "+result.cardBalance);
                  if(result.isActivated=='Y'){//已激活，那就到充值页面
                    $state.go("tab.recharge",{
                      cardCode: cardCode,
                      cardName:result.cardName,
                      cardBalance:result.cardBalance,
                      cardImg:result.cardImg
                    });
                  }else{//到开发页面
                    alert(result.cardCode);
                    $state.go("tab.activate",{
                      cardCode: cardCode,
                      cardName:result.cardName,
                      cardBalance:result.cardBalance,
                      cardImg:result.cardImg
                    });
                  }
              }
            });
          }

        });

      };
  })

  /*
   * Desc 充值
   * Author LN
   * Date 2016-11-19
   * */
  .controller('RechargeCtrl', function($scope, $state, $stateParams, $rootScope) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    $scope.recharge=function (money,cardCode,cardName,cardBalance) {
      if(parseFloat(money)>0){

        var token=$.cookie("token");
        var organizationPartyId=$.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
          type: "POST",
          data: {
            "cardCode": cardCode,
            "token": token,
            "organizationPartyId": organizationPartyId,
            "amount":money
          },
          success: function (result) {
            console.log(result.code+" "+result.msg+" "+parseFloat(money)+parseFloat(cardBalance));
            if(result.code=='200'){
              $state.go("tab.returnChongZhiMess",{
                cardCode:cardCode,
                cardName:cardName,
                money:money,
                amount:parseFloat(money)+parseFloat(cardBalance)
              });
            }
          }
        });
      }
    }
  })

  //充值成功后，页面初始化
  .controller('returnChongZhiMessCtrl', function($scope,$stateParams) {
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
  .controller('ActivateCtrl', function($scope, $state, $stateParams, $rootScope) {
    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    $scope.activate=function (money,cardCode,kaInputPhone,cardName) {
      var token=$.cookie("token");
      var organizationPartyId=$.cookie("organizationPartyId");
      $.ajax({
        url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
        type: "POST",
        data: {
          "cardCode": cardCode,
          "token": token,
          "organizationPartyId": organizationPartyId,
          "amount":money,
          "teleNumber":kaInputPhone
        },
        success: function (result) {
          alert(result.code+" "+result.msg);
          if(result.code=='200'){
            alert("开卡成功！"+cardCode+",充值金额为："+parseFloat(money));
            $state.go("tab.kaika",{
              cardCode:cardCode,
              cardName:cardName,
              money:money,
              kaInputPhone:kaInputPhone
            });
          }
        }
      });
    }

  })

  //开卡成功后，页面初始化
  .controller('kaikaCtrl', function($scope,$stateParams) {
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
  .controller('LoginCtrl', function($scope,$interval,$rootScope,$http) {
    // $scope.tel='15910989807';
    $scope.codeBtn='获取验证码';
    $scope.user={"tel":"17092363583"};

    $scope.getIdentifyCode=function (tel) {
      $scope.msg="";//先清空错误提示
      if(tel){
        $http({
          method: "POST",
          url: $rootScope.interfaceUrl+"getLoginCaptcha",
          data: {
            "teleNumber":tel
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // 默认的Content-Type是text/plain;charset=UTF-8，所以需要更改下
          transformRequest: function(obj) {                                 // 参数是对象的话，需要把参数转成序列化的形式
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

  /*
  * Desc 登录
  * Author LN
  * Date 2016-11-15
  * */
  .controller('login', function($scope,$state,$rootScope) {
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

            $state.go("tab.dash");
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
