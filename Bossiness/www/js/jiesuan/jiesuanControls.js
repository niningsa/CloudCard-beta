angular.module('jiesuan.controllers', [])

  .controller('jiesuanHomeCtrl', function ($scope) {

  })
  //结算方式的页面
  .controller('jiesuanMethodCtrl', function ($scope,$ionicPopup,$state,$ionicModal) {

    $scope.jiesuanList=[{"name":" 包子铺","money":"200元"},
      {"name":" 奶茶店","money":"500元"},
      {"name":" 咖啡店","money":"300元"}];

    $scope.qingsuan=function(jiesuanList){
      alert(jiesuanList.length)
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
  .controller('jiesuanDetailCtrl', function ($scope,$ionicPopup) {
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
            alert(jiesuanList[j].name+":"+jiesuanList[j].money);
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
  .controller('fukuanHomeCtrl', function ($scope,$ionicPopup,$state,$ionicModal) {

    $scope.jiesuanList=[{"name":" 包子铺","money":"200元"},
      {"name":" 奶茶店","money":"500元"},
      {"name":" 咖啡店","money":"300元"}];

    $scope.weekList=[
      {"name":"周日","time":"16:00"},
      {"name":"周一","time":"16:00"},
      {"name":"周二","time":"16:00"},
      {"name":"周三","time":"16:00"},
      {"name":"周四","time":"16:00"},
      {"name":"周五","time":"16:00"},
      {"name":"周六","time":"16:00"}
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

    $scope.setTime = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.qingsuan=function(jiesuanList){
      //alert(jiesuanList.length);
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
            alert(jiesuanList[j].name+":"+jiesuanList[j].money+$("#amountType").val());
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
