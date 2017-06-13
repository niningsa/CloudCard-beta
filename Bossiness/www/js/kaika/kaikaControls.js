angular.module('kaika.controllers', [])

  .controller('kaikaHomeCtrl', function ($scope) {

  })

  /*
   * Desc 无卡开卡（使用手机号来开卡）
   * Author LN
   * Date 2017-4-10
   * */
  .controller("phoneNumberActivateCtrl", function ($http,$interval,$scope,$ionicLoading, $state,$rootScope,$stateParams,kaikaService,$ionicPopup) {
    var token = $.cookie("token");
    $scope.noCardActivate=function(){
      $("#ka").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
      var flag = true;

      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

      if (!phoneReg.test( $scope.teleNumber)) {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请输入正确的手机号码",
          okText: "确定",
        })
        flag = false;
      }
      if (flag) {
        kaikaService.teleNumberActivate(
          $scope.teleNumber,
          $scope.amount,
          $scope.captcha
        ).success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '开卡成功',
            template: '恭喜您开卡成功！'
          });
          alertPopup.then(function (res) {
            //用户点击确认登录后跳转
            $state.go("tab.dash");
          });
        }).error(function (data) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '开卡失败',
            template: data.msg
          });
          alertPopup.then(function (res) {
            //点击确认后跳转开卡页面
            $state.go("tab.kaikaHome");
          });
        });
      }
    };

    //无卡开卡获取手机验证码
    $scope.codeBtn = '获取验证码';
    $scope.getPurchaseCardIdentifyCode = function (teleNumber) {
      $scope.msg = "";//先清空错误提示
      if ($scope.teleNumber) {
        $http({
          method: "POST",
          url: $rootScope.interfaceUrl + "getPurchaseCardCaptchaOfUser",
          data: {
            "token": token,
            "teleNumber": $scope.teleNumber,
            "amount": $scope.amount
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
    };

    //已开卡的列表
    $scope.activateCardList=function(){
      $state.go("tab.activateCardList");
    };
  })

  /*
   * Desc 已开卡的列表（
   * Author WK
   * Date 2017-4-10
   * */
  .controller("activateCardListCtrl", function ($scope,$state,$rootScope,$stateParams,kaikaService,$ionicPopup) {
    kaikaService.activateCardListService().success(function (data) {
      $scope.chatList=data.finAccountList;
    }).error(function (data) {
    });

    $scope.queryBill=function(cardNumber,ownerPartyId,cardId){

      $state.go("tab.activateCardBill",{
        "cardNumber":cardNumber,
        "ownerPartyId":ownerPartyId,
        "cardId":cardId
      });
    };

  })

  /*
   * Desc 已开卡的列表（
   * Author WK
   * Date 2017-4-10
   * */
  .controller("activateCardBillCtrl", function ($scope,$state,$rootScope,$stateParams,kaikaService,billService,$ionicPopup) {
    $scope.cardNumber=$stateParams.cardNumber;
    $scope.ownerPartyId=$stateParams.ownerPartyId;
    $scope.cardId=$stateParams.cardId;
    //已开卡列表的账单详情
    kaikaService.activateCardBillService(
      $scope.cardNumber,
      $scope.ownerPartyId,
      $scope.cardId
    ).success(function (data) {
      $scope.paymentsList=data.paymentsList;
      function getTransDateYearMonth(obj){
        var transDate = parseInt(obj.transDate);
        var date = new Date(transDate);
        return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
      }
      $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
    }).error(function (data) {
    });

    //查询全部的账单
    $scope.all=function(typeId){
      kaikaService.activateCardBillService(
        $scope.cardNumber,
        $scope.ownerPartyId,
        $scope.cardId,
        typeId
      ).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      }).error(function (data) {
      });
    };

    //总消费账单
    $scope.zongConsume=function(typeId){
      kaikaService.activateCardBillService(
        $scope.cardNumber,
        $scope.ownerPartyId,
        $scope.cardId,
        typeId
      ).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      }).error(function (data) {
      });
    };

    //总充值账单
    $scope.zongRecharge=function(typeId){
      kaikaService.activateCardBillService(
        $scope.cardNumber,
        $scope.ownerPartyId,
        $scope.cardId,
        typeId
      ).success(function (data) {
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      }).error(function (data) {
      });
    };

  });
