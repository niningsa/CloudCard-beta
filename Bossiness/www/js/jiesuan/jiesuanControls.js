angular.module('jiesuan.controllers', [])

  .controller('jiesuanHomeCtrl', function ($scope) {

  })
  //结算方式的页面
  .controller('jiesuanMethodCtrl', function ($scope,$ionicPopup,$state) {
    $scope.items=[
      {text:"1",value:"自动模式"},
      {text:"2",value:"手工模式"}
    ];
    $scope.ret={choice:'1'};

    $scope.jiesuanList=[{"name":" 包子铺","money":"200元"},
      {"name":" 奶茶店","money":"500元"},
      {"name":" 咖啡店","money":"300元"}];

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
          alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          jiesuanList[i].checked = true;//这是全选的操作
        }
      } else {
        for (var i = 0; i < jiesuanList.length; i++) {
          jiesuanList[i].checked = false;//这是取消全选的操作
        }
      }
    }

    $scope.gojiesuanDetail=function(jiesuanList){
      alert(222);
      for (var i = 0; i < jiesuanList.length; i++) {
        if(jiesuanList[i].checked==true){
          alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          $state.go("tab.jiesuanDetail");
          break;

        }
      }


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
          alert(jiesuanList[i].name+":"+jiesuanList[i].money);
          jiesuanList[i].checked = true;//这是全选的操作
        }
      } else {
        for (var i = 0; i < jiesuanList.length; i++) {
          jiesuanList[i].checked = false;//这是取消全选的操作
        }
      }
    }
  })
