angular.module('kaika.controllers', [])

  .controller('kaikaHomeCtrl', function ($scope) {

  })

  /*
   * Desc 无卡开卡（使用手机号来开卡）
   * Author LN
   * Date 2017-4-10
   * */
  .controller("phoneNumberActivateCtrl", function ($scope,$state,$rootScope,$stateParams,kaikaService,$ionicPopup) {
    $scope.noCardActivate=function(){
      $("#ka").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
      var flag = true;

      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

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
          $scope.amount
        ).success(function (data) {
          console.log(data);
          var alertPopup = $ionicPopup.alert({
            title: '开卡成功',
            template: '恭喜您开卡成功！'
          });
          alertPopup.then(function (res) {
            //用户点击确认登录后跳转
          })
        }).error(function (data) {

        });
      }

    }

    //已开卡的列表
    $scope.activateCardList=function(){
      $state.go("tab.activateCardList");
    }
  })

  /*
   * Desc 已开卡的列表（
   * Author WK
   * Date 2017-4-10
   * */
  .controller("activateCardListCtrl", function ($scope,$state,$rootScope,$stateParams,kaikaService,$ionicPopup) {
    kaikaService.activateCardListService().success(function (data) {
      console.log(data);
      $scope.chatList=data.finAccountList;
    }).error(function (data) {
    });

    $scope.queryBill=function(cardNumber,ownerPartyId,cardId){

      $state.go("tab.activateCardBill",{
        "cardNumber":cardNumber,
        "ownerPartyId":ownerPartyId,
        "cardId":cardId
      });
    }

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
      console.log(data);
      $scope.paymentsList=data.paymentsList;
      function getTransDateYearMonth(obj){
        var transDate = parseInt(obj.transDate);
        var date = new Date(transDate);
        return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
      }
      $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      console.log( $scope.list);
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
    }
    //总消费账单
    $scope.zongConsume=function(typeId){
      kaikaService.activateCardBillService(
        $scope.cardNumber,
        $scope.ownerPartyId,
        $scope.cardId,
        typeId
      ).success(function (data) {
        console.log(data);
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      }).error(function (data) {
      });
    }

    //总充值账单
    $scope.zongRecharge=function(typeId){
      kaikaService.activateCardBillService(
        $scope.cardNumber,
        $scope.ownerPartyId,
        $scope.cardId,
        typeId
      ).success(function (data) {
        console.log(data);
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      }).error(function (data) {
      });
    }

  })
