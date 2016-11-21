  angular.module('starter.controllers', [])

  //首页
  .controller('DashCtrl', function($scope, $state) {
    $("#zkmoney").height(window.innerHeight*0.6); //heqiao

    var token=$.cookie("token");
    if(token==null){
      $state.go("login");
    }
  })


  /*
   * Desc 账单列表数据展示
   * Author LN
   * Date 2016-11-20
   * */
  .controller('AccountCtrl', function($scope, $rootScope, $http, $state, Chats) {
    var token=$.cookie("token");
    var organizationPartyId=$.cookie("organizationPartyId");

    var charts = Chats.all();                                              // 商家账单
    $scope.Chats = charts;

    if(token==''){
      $state.go("login");
    }
                                                                           // 商家授信额度查询
    $http({
      method: "POST",
      url: $rootScope.interfaceUrl+"getLimitAndPresellInfo",
      data: {
        "token": token,
        "organizationPartyId":organizationPartyId
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
      console.table(result);

      $scope.presellAmount=result.presellAmount;                          //	已卖出金额
      $scope.limitAmount=result.limitAmount;                              //	卖卡限额
      $scope.balance=result.balance;                                      //	卖卡余额
    });

    //刷新操作
    $scope.doRefresh = function() {
      // history.go(0);
    };
  })


  /*
   * Desc 消费扫卡
   * Author LN
   * Date 2016-11-20
   * */
  .controller("XiaofeExampleController", function($scope, $state, $cordovaBarcodeScanner, $rootScope, $http) {
    var token=$.cookie("token");
    var organizationPartyId=$.cookie("organizationPartyId");

    if(token==null){
      $state.go("login");
    }

    //金额必须大于0的数字
    $("input[name='amount']").keyup(function(){
      var amount=$(this).val();
      if(parseFloat(amount)<=0){
        alert("输入金额不合法，请重新输入！！");
        $(this).val("");
        history.go(0);
      }
    });

    $scope.scanBarcode = function(amount) {
      //用于点击确定按钮跳转
          $cordovaBarcodeScanner.scan().then(function(imageData) {
            var cardCode=imageData.text;

            if(cardCode!='') {
              alert(cardCode+" "+token+" "+organizationPartyId);
              $.ajax({
                url: $rootScope.interfaceUrl + "cloudCardWithdraw",
                type: "POST",
                data: {
                  "cardCode": cardCode,
                  "token": token,
                  "organizationPartyId":organizationPartyId,
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
                    }else{
                      alert(result.msg);
                      $.apply(function () {
                        $scope.msg=result.msg;
                      });
                    }
                }
              });

            }

          }, function(error) {
            console.log("An error happened -> " + error);
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
      var token=$.cookie("token");
      var organizationPartyId=$.cookie("organizationPartyId");

      if(token==null){
        $state.go("login");
      }

      $scope.scanBarcode = function() {
         $cordovaBarcodeScanner.scan().then(function(imageData) {

          var cardCode=imageData.text;                // 扫到的数据

          alert(cardCode+" "+token+" "+organizationPartyId);

          if(cardCode!='') {
            $.ajax({
              url: $rootScope.interfaceUrl + "getCardInfoByCode",
              type: "POST",
              data: {
                "cardCode": cardCode,
                "token": token,
                "organizationPartyId":organizationPartyId
              },
              success: function (result) {
                  alert(result.code+" "+result.msg+" "+result.token);
                  alert(result.isActivated+" "+result.cardName+" "+result.cardId+" "+result.cardBalance);

                  // $.removeCookie("token");                //删除旧token
                  // $.cookie("token",result.token,{
                  //   expires:7//七天                       //植入新token
                  // });

                  if(result.code=='200'){
                      if(result.isActivated=='Y'){        //已激活，那就到充值页面
                        $state.go("tab.recharge",{
                          cardCode: cardCode,
                          cardName:result.cardName,
                          cardBalance:result.cardBalance,
                          cardImg:result.cardImg
                        });
                      }else{                              //到开发页面
                        alert(result.cardCode);
                        $state.go("tab.activate",{
                          cardCode: cardCode,
                          cardName:result.cardName,
                          cardBalance:result.cardBalance,
                          cardImg:result.cardImg
                        });
                      }
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
    var token=$.cookie("token");
    var organizationPartyId=$.cookie("organizationPartyId");
    if(token==null){
      $state.go("login");
    }

    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    //金额必须大于0的数字
    $scope.money=10;
    $("input[name='money']").keyup(function(){
        if(parseFloat($(this).val())<=0){
          alert("输入金额不合法，请重新输入！！");
          $(this).val("");
          history.go(0);
        }
    });

    $scope.recharge=function (money,cardCode,cardName,cardBalance) {
      if(parseFloat(money)>0){

        alert(cardCode+" "+token+" "+organizationPartyId);
        $.ajax({
          url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
          type: "POST",
          data: {
            "cardCode": cardCode,
            "token": token,
            "organizationPartyId":organizationPartyId,
            "amount":money
          },
          success: function (result) {
            alert(result.code+" "+result.msg+" "+parseFloat(money)+parseFloat(cardBalance) +" "+result.token);

              if(result.code=='200'){
                $state.go("tab.returnChongZhiMess",{
                  cardCode:cardCode,
                  cardName:cardName,
                  money:money,
                  amount:parseFloat(money)+parseFloat(cardBalance)
                });
              }else{
                $scope.msg=result.msg;l
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
    var token=$.cookie("token");
    var organizationPartyId=$.cookie("organizationPartyId");
    if(token==null){
      $state.go("login");
    }

    $scope.cardCode = $stateParams.cardCode;
    $scope.cardName = $stateParams.cardName;
    $scope.cardImg = $stateParams.cardImg;
    $scope.cardBalance = $stateParams.cardBalance;

    //开卡验证
    //金额必须大于0的数字,电话号码要有效
    $("input[name='money']").keyup(function(){
      if(parseFloat($(this).val())<=0){
        alert("输入金额不合法，请重新输入！！");
        $(this).val("");
        history.go(0);
      }
    });

    $("#kaInputPhone").blur(function(){
      var phone=$(this).val();
      //验证手机号码
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if(phone){
        if (!phoneReg.test(phone)) {
          alert("手机号码有误");
          $(this).val("");
          history.go(0);
        }
      }
    });


    $scope.activate=function (money,cardCode,kaInputPhone,cardName) {

      alert(cardCode+" "+token+" "+organizationPartyId);
      $.ajax({
        url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
        type: "POST",
        data: {
          "cardCode": cardCode,
          "token": token,
          "organizationPartyId":organizationPartyId,
          "amount":money,
          "teleNumber":kaInputPhone
        },
        success: function (result) {
          alert(result.code+" "+result.msg+" "+result.token);

            if(result.code=='200'){
              alert("开卡成功！"+cardCode+",充值金额为："+parseFloat(money));

              // $.removeCookie("token");                         //删除旧token
              // $.cookie("token",result.token,{
              //   expires:7//七天                                //植入新token
              // });

              $state.go("tab.kaika",{
                cardCode:cardCode,
                cardName:cardName,
                money:money,
                kaInputPhone:kaInputPhone
              });
            }else{
              $scope.msg=result.msg;
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
  .controller('loginCtrl', function($scope,$interval,$rootScope,$http) {
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

  /*
   * Desc 登录
   * Author LN
   * Date 2016-11-21
   * */
  .controller('settingCtrl', function($scope,$state) {
      $scope.outLogin=function () {
        $.cookie('token', null);
        $.cookie('organizationPartyId', null);
        $state.go("login");
      }
  })

;
