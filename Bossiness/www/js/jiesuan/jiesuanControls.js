angular.module('jiesuan.controllers', [])

  .controller('jiesuanHomeCtrl', function ($scope) {

  })
  //结算方式的页面
  .controller('jiesuanMethodCtrl', function ($scope,$ionicPopup,$state,$ionicModal,jiesuanService) {

    jiesuanService.bizListNeedSettlement().success(function (data) {
      console.log(data);
      $scope.jiesuanList=data.list
    }).error(function (data) {
    });

    //收款方发起清算的请求
    $scope.qingsuanRequest=function(jiesuanList){

      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){
            $("#faqi").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
            jiesuanService.initiateSettlement(
              jiesuanList[j].paymentId,
              jiesuanList[j].cardSellerId,
              jiesuanList[j].tradePartyId,
              jiesuanList[j].amount,
              jiesuanList[j].reqCount
            ).success(function (data) {
              console.log(data);


            }).error(function (data) {
            });
          }
        }
        $ionicPopup.alert({
          title: "温馨提示",
          template: "操作成功!!",
          okText: "确定",
        })
      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请至少选择一个!!",
          okText: "确定",
        })
      }
    }

   //确认清算
    $scope.qingsuanConfirm=function(jiesuanList){

      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){
            $("#qr").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
            jiesuanService.settlementConfirmation(
              jiesuanList[j].paymentId,
              jiesuanList[j].cardSellerId,
              jiesuanList[j].tradePartyId,
              jiesuanList[j].amount
            ).success(function (data) {
              console.log(data);

                jiesuanService.bizListNeedSettlement().success(function (data) {
                  console.log(data);
                  $scope.jiesuanList=data.list
                }).error(function (data) {
                });


            }).error(function (data) {
            });
          }
        }
        $ionicPopup.alert({
          title: "温馨提示",
          template: "操作成功!!",
          okText: "确定",
        })
      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请至少选择一个!!",
          okText: "确定",
        })
      }
    }

    //投诉
    $scope.tousu=function(jiesuanList){
      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){
            //alert(jiesuanList[j].name+":"+jiesuanList[j].money+$("#amountType").val());
            if(jiesuanList[j].reqCount>=3){
              $ionicPopup.alert({
                title: "温馨提示",
                template: "投诉成功!!",
                okText: "确定",
              })
            }else{
              $ionicPopup.alert({
                title: "温馨提示",
                template: "投诉失败!!",
                okText: "确定",
              })
            }
          }
        }
      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请至少选择一个投诉!!",
          okText: "确定",
        })
      }
    }

    //全选和全不选的操作
    $scope.selectAll=function(jiesuanList,quanxuan){
      if (quanxuan == true) {
        for (var i = 0; i < jiesuanList.length; i++) {
          //alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          jiesuanList[i].checked = true;//这是全选的操作
        }
      } else {
        for (var i = 0; i < jiesuanList.length; i++) {
          jiesuanList[i].checked = false;//这是取消全选的操作
        }
      }
    }

    $scope.gojiesuanDetail=function(jiesuanList){
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          //alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          $state.go("tab.jiesuanDetail");
          break;

        }
      }
    }

    $scope.fukuanJieSuan=function(){
     $state.go("tab.fukuanHome");
    }

  })

  //结算的详细页面
  .controller('jiesuanDetailCtrl', function ($scope,$ionicPopup,jiesuanService) {
    $scope.jiesuanList=[{"name":" 17年4月20日","money":"200元"},
                        {"name":" 17年4月21日","money":"500元"},
                        {"name":" 17年4月22日","money":"300元"}];

    $scope.qingsuan=function(jiesuanList){

      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){

          }
        }
      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请至少选择一个结算!!",
          okText: "确定",
        })
      }
    }
    //全选和全不选的操作
    $scope.selectAll=function(jiesuanList,quanxuan){
      if (quanxuan == true) {
        for (var i = 0; i < jiesuanList.length; i++) {
          //alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          jiesuanList[i].checked = true;//这是全选的操作
        }
      } else {
        for (var i = 0; i < jiesuanList.length; i++) {
          jiesuanList[i].checked = false;//这是取消全选的操作
        }
      }
    }
  })



  //付款结算的页面
  .controller('fukuanHomeCtrl', function ($scope,$ionicPopup,$state,$ionicModal,jiesuanService) {
    jiesuanService.fukuanbizListNeedSettlement().success(function (data) {
      console.log(data);
      $scope.jiesuanList=data.list
    }).error(function (data) {
    });

    $scope.weekList=[
      {"name":"周日","time":"16:00",value:"7",realtime:"16"},
      {"name":"周一","time":"16:00",value:"1",realtime:"16"},
      {"name":"周二","time":"16:00",value:"2",realtime:"16"},
      {"name":"周三","time":"16:00",value:"3",realtime:"16"},
      {"name":"周四","time":"16:00",value:"4",realtime:"16"},
      {"name":"周五","time":"16:00",value:"5",realtime:"16"},
      {"name":"周六","time":"16:00",value:"6",realtime:"16"}
    ]
    $scope.show='1';
    $scope.change=function(amountType){
      if(amountType=='2'){
        $scope.show='2';
      }else{
        $scope.show='1';
      }

    }

    // 结算单模态框
    $ionicModal.fromTemplateUrl('templates/jiesuan/setTimeModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.setTime = function (jiesuanList) {
      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        var count=0;
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){
            count++;

          }
        }
        //只能让他选择一个店铺来设置时间
        if(count==1){
          for (var j = 0; j < jiesuanList.length; j++) {
            if(jiesuanList[j].checked==true){
              $scope.tradePartyId=jiesuanList[j].tradePartyId;
              $scope.cardSellerId=jiesuanList[j].cardSellerId;
            }
          }
          $scope.modal.show();
        }else{
          $ionicPopup.alert({
            title: "温馨提示",
            template: "只能选择一个!!",
            okText: "确定",
          })
        }

      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请选择一个店铺!!",
          okText: "确定",
        })
      }

    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    //付款方的清算
    $scope.qingsuan=function(jiesuanList){

      var flag = false;
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          flag = jiesuanList[i].checked;
          break;
        }
      }
      if(flag){
        for (var j = 0; j < jiesuanList.length; j++) {
          if(jiesuanList[j].checked==true){
            $("#qs").attr("disabled","disabled");//这是为了重复的提交，所以给它弄死
            jiesuanService.settlementRequest(
              jiesuanList[j].paymentId,
              jiesuanList[j].cardSellerId,
              jiesuanList[j].tradePartyId,
              jiesuanList[j].amount
            ).success(function (data) {
              console.log(data);

                jiesuanService.fukuanbizListNeedSettlement().success(function (data) {
                  console.log(data);
                  $scope.jiesuanList=data.list
                }).error(function (data) {
                });


            }).error(function (data) {
            });
          }
        }
        $ionicPopup.alert({
          title: "温馨提示",
          template: "操作成功!!",
          okText: "确定",
        })
      }else{
        $ionicPopup.alert({
          title: "温馨提示",
          template: "请至少选择一个!!",
          okText: "确定",
        })
      }
    }

    //全选和全不选的操作
    $scope.selectAll=function(jiesuanList,quanxuan){
      if (quanxuan == true) {
        for (var i = 0; i < jiesuanList.length; i++) {
          //alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          jiesuanList[i].checked = true;//这是全选的操作
        }
      } else {
        for (var i = 0; i < jiesuanList.length; i++) {
          jiesuanList[i].checked = false;//这是取消全选的操作
        }
      }
    }

    $scope.gojiesuanDetail=function(jiesuanList){
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          //alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          $state.go("tab.jiesuanDetail");
          break;
        }
      }

    }
    $scope.fukuanJieSuan=function(){
      $state.go("tab.fukuanHome");
    }
    //自动模式的结算
$scope.autoRequest=function(weekList,tradePartyId,cardSellerId){
  var flag = false;
  for (var i = 0; i < weekList.length; i++) {
    if(weekList[i].checked==true){
      flag = weekList[i].checked;
      break;
    }
  }
  if(flag){
    for (var j = 0; j < weekList.length; j++) {
      if(weekList[j].checked==true){
        jiesuanService.bizSetCloudcardSettlementPeriod(
          weekList[j].value,
          weekList[j].realtime,
          tradePartyId,
          cardSellerId
        ).success(function (data) {

        }).error(function (data) {
        });
      }
    }
    var alertPopup = $ionicPopup.alert({
      title: '成功',
      template: "成功！"
    });
    alertPopup.then(function(res) {
      $scope.modal.hide();
      $state.go("tab.fukuanHome");
    });
  }else{
    $ionicPopup.alert({
      title: "温馨提示",
      template: "请至少选择一个结算!!",
      okText: "确定",
    })
  }

}
  })
