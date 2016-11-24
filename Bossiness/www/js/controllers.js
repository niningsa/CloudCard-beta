  angular.module('starter.controllers', [])

  //首页
  .controller('DashCtrl', function($scope, $state) {
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

    var charts = Chats.all(0);                                              // 商家账单
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

    //下拉刷新操作
    $scope.doRefresh = function() {
      $("#amountType").val(0);                                            //刷新的同时，将下拉变为全部

      var charts = Chats.all(0);                                           // 商家账单
      $scope.Chats = charts;

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

      $scope.$broadcast("scroll.refreshComplete");
    };


    //下拉列表分类显示
    $scope.change = function(amountType){
      var charts = Chats.all(amountType);                                   // 商家账单
      $scope.Chats = charts;
    }

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

    $scope.scanBarcode = function(amount) {
      $scope.msg='';
      var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,3})?$/;

      //金额必须大于0的数字..痛苦 0_o||
      if(!reg.test(amount)){
        $scope.msg='输入金额不合法，请重新输入！！';
        $("input[name='amount']").val("");
      }else{
        if(parseFloat(amount)<=0){
          $scope.msg='输入金额不合法，请重新输入！！';
          $("input[name='amount']").val("");
        }else{
          // 扫描
          $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.msg="";
            $scope.save=true;
            //清空错误提示
            var cardCode=imageData.text;

            if(cardCode!='') {
              // alert(cardCode+" "+token+" "+organizationPartyId);
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
                  // alert(result.code+" "+result.msg+"　"+result.amount+" "+result.cardBalance);
                    if(result.code=='200'){
                      $state.go("tab.returnMess",{
                        cardCode:cardCode,
                        amount:amount,
                        cardBalance:result.cardBalance
                      });
                    }else{
                      $scope.$apply(function () {
                        $scope.msg=result.msg;
                        $scope.save=false;
                      });
                    }
                }
              });

            }

          }, function(error) {
            console.log("An error happened -> " + error);
          });

        }
      }


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

          // alert(cardCode+" "+token+" "+organizationPartyId);

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
                  // alert(result.code+" "+result.msg+" "+result.token);
                  // alert(result.isActivated+" "+result.cardName+" "+result.cardId+" "+result.cardBalance);

                  if(result.code=='200'){
                      if(result.isActivated=='Y'){        //已激活，那就到充值页面
                        $state.go("tab.recharge",{
                          cardCode: cardCode,
                          cardName:result.cardName,
                          cardBalance:result.cardBalance,
                          cardImg:result.cardImg
                        });
                      }else{                              //到开发页面
                        // alert(result.cardCode);
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

    // $scope.moneys = [100,200,500,1000,1500,2000,2500,3000];

    $scope.recharge=function (money,cardCode,cardName,cardBalance) {

        // alert(cardCode+" "+token+" "+organizationPartyId);
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
            // alert(result.code+" "+result.msg+" "+parseFloat(money)+parseFloat(cardBalance) +" "+result.token);

              if(result.code=='200'){
                $state.go("tab.returnChongZhiMess",{
                  cardCode:cardCode,
                  cardName:cardName,
                  money:money,
                  amount:parseFloat(money)+parseFloat(cardBalance)
                });
              }else{
                $scope.$apply(function () {
                  $scope.msg=result.msg;
                });
              }
          }
        });
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

    $scope.activate=function (money,cardCode,kaInputPhone,cardName) {
      //验证手机号码
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if(!phoneReg.test(kaInputPhone)){
        $scope.msg="请输入正确的电话号码！";
      }else{
        // 提交开卡请求
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
            // alert(result.code+" "+result.msg);

              if(result.code=='200'){
                // alert("开卡成功！"+cardCode+",充值金额为："+parseFloat(money));

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
                $scope.$apply(function () {
                  $scope.msg=result.msg;
                });
              }
          }
        });
      }

      // alert(cardCode+" "+token+" "+organizationPartyId);
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
    $scope.user={"tel":"","identifyCode":""};

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
   * Desc 退出
   * Author LN
   * Date 2016-11-21
   * */
  .controller('settingCtrl', function($scope,$state,$ionicPopup) {
      $scope.outLogin=function () {

        $ionicPopup.confirm({
          title:"退出",
          template:"是否要退出登录?",
          cancelText:"取消",
          okText:"确定"
        }).then(function(res){
          if(res){
            $state.go("login");
          }
        })
      }
  })

;
