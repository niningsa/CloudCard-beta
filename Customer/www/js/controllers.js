angular.module('starter.controllers', [])

//我的圈子的页面展示
  .controller('myCircleCtrl', function($scope,$state, $rootScope, $ionicScrollDelegate) {

  })

  //店铺的展示页面
  .controller('shopCtrl', function($scope,$state, $rootScope, $ionicScrollDelegate) {

  })
  //我的圈子的定位显示
  .controller('circleMapCtrl', function($scope,$state, $rootScope, $ionicScrollDelegate) {
    $scope.storeInfo = false;

    //$scope.chats = Chats.all();
    //$scope.doRefresh = function() {
    //  $scope.chats = Chats.all();
    //  $scope.$broadcast("scroll.refreshComplete");
    //};

    navigator.geolocation.getCurrentPosition(function (data) {
      //var loc = JSON.parse(data);
      //alert(data.coords.longitude);
      //alert(data.coords.latitude);
      //调用方法更具坐标来解析地址
      //var point = (parseFloat(data.coords.longitude)+0.006486, parseFloat(data.coords.latitude)+0.006061);//真实定位
      var point = (121.419634, 31.207267);
      //$scope.ret = {longitude:121.419633, latitude:31.207256};
      var map = new BMap.Map("allmap");                           // 创建Map实例
      //如何放置自定义的marker
      //var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));
      //var marker = new BMap.Marker(point,{icon:myIcon});                        // 创建标注
      // 将标注添加到地图中
      var points = [
        {longitude: 121.419634, latitude: 31.207267},
        {longitude: 121.4196591, latitude: 31.207529},
        {longitude: 121.4196796, latitude: 31.207736},
        {longitude: 121.4196796, latitude: 31.207634}
      ];

      //循环Json数组
      for (var o in points) {
        var longitude = points[o].longitude;
        var latitude = points[o].latitude;
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标
        map.centerAndZoom(point, 19);
        var marker = new BMap.Marker(point);                        // 创建标注
        map.addOverlay(marker);   // 将标注添加到地图中
        (function(p, m){
          m.addEventListener("click", function () {
             alert("精度是："+ longitude+"维度是："+ latitude);
            //m.openInfoWindow(infoWindow, p); //开启信息窗口
            // $state.go("tab.myCircle");
            //window.location.href="#/tab/myCircle";
            $scope.storeInfo = true;
            // alert(p.lat);
            $scope.longitude = 121.5;
            $scope.latitude = 32.2;
          })
        })(point, marker);
      }


      var myLabel = new BMap.Label("上海班富", //为lable填写内容
        {position: point}); //label的位置
      myLabel.setStyle({ //给label设置样式，任意的CSS都是可以的
        "color": "red", //颜色
        "fontSize": "12px", //字号
        "border": "0", //边
        "height": "20px", //高度
        "width": "50px" //宽
      });
      map.addOverlay(myLabel); //把label添加到地图上

      //将圆形扩状物加载到地图上
      var circle = new BMap.Circle(point, 30, {
        fillColor: "#22B2E7",
        strokeWeight: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.3,
        enableEditing: true
      });
      map.addOverlay(circle); //增加圆

      //创建信息窗口
      var opts = {
        width: 400,     // 信息窗口宽度
        height: 120,     // 信息窗口高度
        title: "坤哥",
        message: ""
      }
      //var showInfo = "地址：" + data.nurseryInfo[item].Addresss + "<br/>" + "描述：" + data.nurseryInfo[item].BasicFacts + "<br/>面积：" + data.nurseryInfo[item].HouseArea + "<br/>地块个数:" + data.nurseryInfo[item].nurseryBlockCount;
      var showInfo = "店铺称：" + "<a href='http://www.baidu.com'  >南塘包子铺</a>" + "<br/>" + "描述：相当棒" + "<br/>面积：78m" + "<br/>地块个数:32个";
      var infoWindow = new BMap.InfoWindow(showInfo, opts);  // 创建信息窗口对象
      //如何给定位后的图片添加点击的事件  href='#tab/myCircle'


    }, function (error) {
      alert("网络不可用，请打开网络!!");
      console.log(error);

    });

    //$("body").on("click", "#aa", function(){
    //  alert(888);
    //});
    //document.getElementById('aa').onclick = function(){
    //
    // alert(888);
    //
    //};

  })
  //其他授权的方式
.controller('DashCtrl', function($scope,$stateParams) {

    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.fromDate = $stateParams.fromDate;
    $scope.thruDate = $stateParams.thruDate;
    $scope.cardName = $stateParams.cardName;
  })

  //C端跳转成功页面的传值
.controller('paymentSuccessCtrl', function($scope,$stateParams) {

    $scope.type = $stateParams.type;
    $scope.cardId = $stateParams.cardId;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;
  })
  //转卡成功后的跳转页面
.controller('sellCardSuccessCtrl', function($scope,$stateParams) {

    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.tel = $stateParams.tel;
  })
  //c端扫码消费成功之后的页面跳转
.controller('userPaymentSuccessCtrl', function($scope,$stateParams) {


    $scope.storeName = $stateParams.storeName;
    $scope.amount = $stateParams.amount;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.type = $stateParams.type;
  })
  //默认授权的方式
.controller('DashAccreditCtrl', function($scope,$stateParams) {

    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.day = $stateParams.day;
    $scope.cardName = $stateParams.cardName;
  })

.controller('ChatsCtrl', function($scope, Chats,$state, $rootScope, $ionicScrollDelegate) {

  $scope.chats = Chats.all();
    $scope.doRefresh = function() {
      $scope.chats = Chats.all();
      $scope.$broadcast("scroll.refreshComplete");
    };

})


  //分账单的页面查询

  .controller('subBillCtrl', function($scope, CardDetail,$state,$rootScope,$stateParams) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardDetail= CardDetail.get($scope.cardId);
    $scope.items=[
      {text:"0",value:"全部"},
      {text:"1",value:"充值"},
      {text:"2",value:"消费"}
    ];
    //默认选择全部
    $scope.ret={choice:'0'};

    $scope.cardDetails = CardDetail.get($scope.cardId);
    $scope.cardDetail = $scope.cardDetails;

    //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.get($scope.cardId);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

    };

    //下拉列表分类显示，查询全部是请求后台，按照类型去查询的时候就使用_.filter在查询出来的数据进行过滤
    $scope.change = function(amountType){
      //第一次查询全部的时候调用后台去查询一下
      if("0" == amountType){
        $scope.cardDetail = $scope.cardDetails;
      }else{
        //-.filter  lodash实现过滤，利用第一次查询的数据第二次做筛选
        $scope.cardDetail =  _.filter($scope.cardDetails, function(o){  //提高效率（从缓存中过滤数据，不用请求后台，好屌）
          return o.type==amountType;
        });
      }

    }
  })


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $state, $ionicPopup, $rootScope, $ionicModal) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;
    //alert($scope.lastText);
  //$scope.chat = Chats.get($stateParams.chatId);
  //  console.table($scope.chat );
  // alert(jQuery('#output'));
  //  将客户的cardCode放入生成的二维码中
   jQuery('#output').qrcode($stateParams.cardCode);
    //根据是否授权来控制授权按钮的显示与否
    //if($stateParams.isAuthToOthers=='N' & $scope.isAuthToMe=='N'){
    //  //jQuery('#sq').html('你可以<a href="#/tab/cardinput/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'">授权</a>给你好友！');
    //  jQuery('#sq').html('你可以<a href="#/tab/accredit/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'">授权</a>给你好友！');
    //}else{
    //  jQuery('#sq').html('该卡已被授权,你可以<a href="#/tab/revokeCardAuth/'+$stateParams.cardId+'/'+$stateParams.cardBalance+'/'+$stateParams.cardName+'/'+$stateParams.cardCode+'/'+$stateParams.isAuthToOthers+'/'+$scope.isAuthToMe+'">解除授权</a>');
    //
    //}
   //绑定事件判断到底是应该解除授权还是授权
    if($stateParams.isAuthToOthers=='N' & $scope.isAuthToMe=='N'){
      $scope.shouQuan=true;
      $scope.jieChu=false;
      $scope.zhuanKa=true;

    }else if($stateParams.isAuthToOthers=='Y'){//卡主人可以解除授权
      $scope.shouQuan=false;
      $scope.jieChu=true;
    }else{
      $scope.shouQuan=false;
      $scope.jieChu=false;

    }
  //转卡的操作
  $scope.sellCard=function(cardId,cardBalance,cardName,cardCode,isAuthToOthers,isAuthToMe){
    window.location.href="#/tab/sellCard/"+cardId+"/"+cardBalance+"/"+cardName+"/"+cardCode+"/"+isAuthToOthers+"/"+isAuthToMe;
  }
    //卡授权
    $scope.sq=function(cardId,cardBalance,cardName,cardCode,isAuthToOthers,isAuthToMe){
      window.location.href="#/tab/accredit/"+cardId+"/"+cardBalance+"/"+cardName+"/"+cardCode+"/"+isAuthToOthers+"/"+isAuthToMe;
    };
  //卡解除授权
  $scope.jc=function(cardId,cardBalance,cardName,cardCode){
    var token=$.cookie("token");
    $.ajax({
      type: "POST",
      url: $rootScope.interfaceUrl+"revokeCardAuth",
      async: false,
      data: {
        "token":token,
        "cardId":$scope.cardId
        //"amount":$other_money,
        //"cardCode": $scope.cardCode,
        //"cardName": $scope.cardName,
      },
      dataFilter: function(data){
        console.log("raw data: "+data);
        var idx =  data.indexOf("//");
        if(data && /^\s*\/\/.*/.test(data) && idx>-1){
          data = data.substring(idx+2);
        }
        return data;
      },
      success: function(data){
        console.log(data);
        if(data.code==500){
          $ionicPopup.alert({
            title:"温馨提示",
            template:data.msg,
            okText:"确定",

          })
        }
        //跳转到登录的页面
        if(data.code==400){
          $state.go("login");
        }
        if(data.code==200){

          $ionicPopup.alert({
            title:"温馨提示",
            template:"解卡成功",
            okText:"确定",
          })
            .then(function(res){
          if(res){
            $state.go("tab.chats");
          }
        })
          //授权成功，传入必要的参数，跳转到授权成功的查看页面
          //window.location.href="#/tab/chats/"+$scope.cardId+"/"+$scope.cardBalance+"/"+$scope.cardName+"/"+$scope.cardCode+"/"+ $scope.isAuthToOthers+"/"+$scope.isAuthToMe;
        }
      },
      error:function (e) {
        console.log(e);
      }
    });
  };
})


//授权的controller
.controller('inputCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
   $scope.cardId  =$stateParams.cardId;
   $scope.cardBalance  =$stateParams.cardBalance;
   $scope.cardName  =$stateParams.cardName;
   $scope.cardCode  =$stateParams.cardCode;
   $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
   $scope.isAuthToMe  =$stateParams.isAuthToMe;
    var token=$.cookie("token");



  $("body").off("click", "#powerfrom").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_cardId=$("#other_cardId").val();
    //$other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();

    var flag =true;

    //验证手机号是否合法
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

    if (!phoneReg.test($other_tel)) {
      $ionicPopup.alert({
        title:"温馨提示",
        template:"请输入正确的手机号码",
        okText:"确定",
      })
          flag = false;
     }
    //正则验证输入金额是否合法
    // var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
    // if (moneyReg.test($other_money)) {
    //    if(parseFloat($other_money) > parseFloat($scope.cardBalance)){
    //
    //      $ionicPopup.alert({
    //        title:"温馨提示",
    //        template:"授权金额大于可用金额",
    //        okText:"确定",
    //      })
    //      flag = false;
    //    }
    // }else{
    //   $ionicPopup.alert({
    //     title:"温馨提示",
    //     template:"金额输入有误,请重新输入",
    //     okText:"确定",
    //
    //   })
    //      flag = false;
    // }

    if ($other_endDate == null | $other_endDate ==''){
      $ionicPopup.alert({
        title:"温馨提示",
        template:"请将时间填写完整",
        okText:"确定",
      })
      //var nowtime = new Date();
      //$other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
      flag = false;
    }
    if ($other_startDate == null | $other_startDate ==''){
      //var nowtime2 = new Date();
      //$other_endDate = nowtime2.toLocaleDateString().replace('/','-').replace('/','-');
      $ionicPopup.alert({
        title:"温馨提示",
        template:"请将时间填写完整",
        okText:"确定",
      })
      flag = false;
    }
    if($other_startDate > $other_endDate ){
      $ionicPopup.alert({
        title:"温馨提示",
        template:"截止时间应大于授权时间",
        okText:"确定",
      })
      flag = false;
    }
    if(flag){
      $.ajax({
        type: "POST",
        url: $rootScope.interfaceUrl+"createCardAuth",
        async: false,
        data: {
         "token":token,
          "cardId":$other_cardId,
          "teleNumber":$other_tel,
          //"amount":$other_money,
          "fromDate":$other_startDate,
          "thruDate":$other_endDate
        },
        dataFilter: function(data){
          console.log("raw data: "+data);
          var idx =  data.indexOf("//");
          if(data && /^\s*\/\/.*/.test(data) && idx>-1){
            data = data.substring(idx+2);
          }
          return data;
        },
        success: function(data){
          console.log(data);
          if(data.code==500){
            $ionicPopup.alert({
              title:"温馨提示",
              template:data.msg,
              okText:"确定",

            })
          }
          //跳转到登录的页面
          if(data.code==400){
            $state.go("login");
          }
          if(data.code==200){
            //授权成功，传入必要的参数，跳转到授权成功的查看页面
            window.location.href="#/tab/cardreturn/"+$other_tel+"/"+$scope.cardBalance+"/"+$other_startDate+"/"+$other_endDate+"/"+$scope.cardName;
          }


        },
        error:function (e) {
          console.log(e);

          window.location.href="#/tab/cardinput";
        }
      });


    };
  });
})


  //转卡页面的传值
  .controller('inputsellCardCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode = $stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

    $scope.sellCard=function(cardName,cardBalance){
      var tel=$("#telphone").val();
      var token=$.cookie("token");

      var flag =true;
      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test(tel)) {
        $scope.msg = '手机号码输入有误，请重新输入！！';
        //$("#telphone").val(" ");
        flag = false;
      }
      $ionicPopup.confirm({
          title:"转卡",
          template:"是否确认转卡??",
          okText:"确定",
          cancelText:"取消"
        })
        .then(function(res){
          if(res) {
            if(flag){
              $.ajax({
                url:$rootScope.interfaceUrl+"modifyCardOwner",
                type:"POST",
                data: {
                  "token":token,
                  "teleNumber":tel,
                  "cardId":$scope.cardId
                },
                success: function(result){
                  console.log(result);
                  if(result.code=="200"){
                    $state.go("tab.sellCardSuccess",{
                      "cardBalance":cardBalance,
                      "cardName":cardName,
                      "tel":tel
                    });
                  }
                  if(result.code==500){
                    $ionicPopup.alert({
                      title:"温馨提示",
                      template:data.msg,
                      okText:"确定",

                    })
                    //alert("授权失败,"+data.msg);
                  }
                  //跳转到登录的页面
                  if(result.code==400){
                    $state.go("login");
                  }
                }
              });
            }
          }
          })


    }
  })
  //授权的默认界面

  .controller('inputAccreditCtrl', function($scope, $stateParams,$rootScope,$http,Chats,$state,$ionicPopup) {
    $scope.cardId  =$stateParams.cardId;
    $scope.cardBalance  =$stateParams.cardBalance;
    $scope.cardName  =$stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;
    var token=$.cookie("token");

    $scope.daylist = [
      { text: "一天", value: "1" },
      { text: "永久", value: "0" }

    ];
    //给默认的初始值
    $scope.ret={choice:'1'};

    $("body").off("click", "#powerfrom").on("click","#powerfrom", function() {
      $other_tel=$("#other_tel").val();
      $other_cardId=$("#other_cardId").val();
      $other_money=$("#other_money").val();
      $day=$("#day").val();
      var flag =true;

      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test($other_tel)) {
        $ionicPopup.alert({
          title:"温馨提示",
          template:"请输入正确的手机号码",
          okText:"确定",
        })
        flag = false;
      }
      //正则验证输入金额是否合法
      var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
      if (moneyReg.test($other_money)) {
        if(parseFloat($other_money) > parseFloat($scope.cardBalance)){

          $ionicPopup.alert({
            title:"温馨提示",
            template:"授权金额大于可用金额",
            okText:"确定",
          })
          flag = false;
        }
      }else{
        $ionicPopup.alert({
          title:"温馨提示",
          template:"金额输入有误,请重新输入",
          okText:"确定",

        })
        flag = false;
      }

      if(flag){
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl+"createCardAuth",
          async: false,
          data: {
            "token":token,
            "cardId":$other_cardId,
            "teleNumber":$other_tel,
            //"amount":$other_money,//默认授权的金额默认先不填，为了保证金额的正确性
            "day":$day
          },
          dataFilter: function(data){
            console.log("raw data: "+data);
            var idx =  data.indexOf("//");
            if(data && /^\s*\/\/.*/.test(data) && idx>-1){
              data = data.substring(idx+2);
            }
            return data;
          },
          success: function(data){
            console.log(data);
            if(data.code==500){
              $ionicPopup.alert({
                title:"温馨提示",
                template:data.msg,
                okText:"确定",

              })
              //alert("授权失败,"+data.msg);
            }
            //跳转到登录的页面
            if(data.code==400){
              $state.go("login");
            }
            if(data.code==200){
              //授权成功，传入必要的参数，跳转到授权成功的查看页面
              window.location.href="#/tab/cardreturnsuccess/"+$other_tel+"/"+$other_money+"/"+$day+"/"+$scope.cardName;
            }

          },
          error:function (e) {
            console.log(e);

            window.location.href="#/tab/cardinput";
          }
        });


      };
    });
  })

  //账单信息
.controller('CardDetailCtrl', function($scope,CardDetail,$rootScope,$ionicLoading,$timeout) {

  // $(".item-content.disable-pointer-events").css("padding-right","40px");

  $scope.items=[
    {text:"0",value:"全部"},
    {text:"1",value:"充值"},
    {text:"2",value:"消费"}
  ];
  //默认选择全部
  $scope.ret={choice:'0'};


  //$("#amountType").val(0);

  var viewSize=20;//账单一开始默认加载20条数据
  $scope.cardDetails = CardDetail.all(0,viewSize);
  $scope.cardDetail = $scope.cardDetails;

  //下拉刷新的功能
    $scope.doRefresh = function() {
      //下拉刷新的时候选中全部
      var viewSize=20000;
      $scope.ret={choice:'0'};
      $scope.cardDetails = CardDetail.all(0,viewSize);
      $scope.cardDetail = $scope.cardDetails;
      //下拉刷新完成后提示转圈消失
      $scope.$broadcast("scroll.refreshComplete");

    };
  //上拉触发函数,总账单的下拉加载更多内容
     $scope.loadMore = function () {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $scope.cardDetailsSS = CardDetail.all(0, 20000);
      if (viewSize < $scope.cardDetailsSS.length) {//当页面显示的条数小于总条数是下拉加载才生效
        $ionicLoading.show({
          template: "正在加载数据...."
        });
        $timeout(function () {
          $ionicLoading.hide();
          viewSize += 20;
          $scope.ret = {choice: '0'};
          $scope.cardDetails = CardDetail.all(0, viewSize);
          $scope.cardDetail = $scope.cardDetails;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
      } else {
        //结束加载的转圈
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

  };

  //下拉列表分类显示，这种方式主要是通过后台去查询，这样做可以实现效果但是如果数据量比较大的话就会导致系统卡
  //$scope.change = function(amountType){
  //  console.log(amountType);
  //  var cardDetail = CardDetail.all(amountType);                                   // 商家账单
  //  $scope.cardDetail = cardDetail;
  //}
  //下拉列表分类显示，查询全部是请求后台，按照类型去查询的时候就使用_.filter在查询出来的数据进行过滤
  $scope.change = function(amountType){

    //第一次查询全部的时候调用后台去查询一下
      //-.filter  lodash实现过滤，利用第一次查询的数据第二次做筛选
      //$scope.cardDetail =  _.filter($scope.cardDetails, function(o){  //提高效率（从缓存中过滤数据，不用请求后台，好屌）
      //  return o.type==amountType;
      //});
      $scope.cardDetail = CardDetail.all(amountType, viewSize);
      $scope.loadMore = function () {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $scope.cardDetailsSS = CardDetail.all(amountType, 20000);
        if (viewSize < $scope.cardDetailsSS.length) {//当页面显示的条数小于总条数是下拉加载才生效
          $ionicLoading.show({
            template: "正在加载数据...."
          });
          $timeout(function () {
            $ionicLoading.hide();
            viewSize += 20;
            $scope.cardDetails = CardDetail.all(amountType, viewSize);
            $scope.cardDetail = $scope.cardDetails;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
        } else {
          //结束加载的转圈
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

  }

  })




//退出登录
  .controller('settingCtrl', function($scope,$state,$ionicPopup,$rootScope) {
    var token=$.cookie("token");
    var registrationID=$.cookie("registrationID");
    $scope.outLogin=function () {

      $ionicPopup.confirm({
          title:"退出",
          template:"是否退出要退出登录",
          okText:"确定",
          cancelText:"取消"
        })
        .then(function(res){
          if(res){

            $.cookie('token', null);
            $.cookie('organizationPartyId', null);
            //极光推送开始
            //退出时销毁极光推送的registrationID
            $.ajax(
              { url: $rootScope.interfaceUrl+"removeJpushRegId",
                type:"POST",
                data: {
                  "token":token,
                  "regId":registrationID
                },
                success: function(result){
                  //alert(result.msg);
                }
              });

            $state.go("login");//跳转到登录页面
          }
        })

    }
  })








//获取验证码
.controller('LoginCtrl', function($scope,$interval,$rootScope,$http,$state) {
  // $scope.tel='15910989807';
  //$scope.user={
  //  tel:"18702104254"
  //};
  //为了让安卓手机按返回时不跳到登陆页面，判断tooken
  $scope.$on('$ionicView.beforeEnter', function () {                           // 这个玩意儿不错，刚加载执行的广播通知方法
    $scope.user = {"identifyCode": ""};                                          // 退出登录后，清空验证码
    if ($.cookie("token") != null) { // 登录成功了，按物理返回键，就别想重新登录
      $state.go("tab.chats");
    }
  });
  $scope.codeBtn='获取验证码';

  $scope.getIdentifyCode=function (tel) {
    $scope.msg="";//先清空错误提示
    if(tel){
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
          // console.log(result);
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
          // console.log(result.code+" "+result.msg);
          if(result.code=='200'){
            var registrationID=$.cookie("registrationID");
            var platform=$.cookie("platform");
            $scope.$apply(function () {
              $scope.msg="";
            });
            //将token 存入cookie 过期时间7天
            $.cookie("token",result.token,{
              expires:7
            });
            $.ajax(
              { url: $rootScope.interfaceUrl+"regJpushRegId",
                type:"POST",
                data: {
                  "token":result.token,
                  "regId":registrationID,
                  "deviceType":platform,
                  "appType":"user"
                },
                success: function(result){
                  //极光推送后台数据获取
                }
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



//扫码消费
  .controller("scanPaymentController", function ($scope, $state, $cordovaBarcodeScanner, $rootScope, $ionicPopup, $ionicLoading, $timeout,$stateParams) {
    var token = $.cookie("token");
    $scope.cardId = $stateParams.cardId;
    if (token == null) {
      $state.go("login");
    }
    $scope.scanBarcode = function () {
      $ionicLoading.show({
        template: "正在调摄像头,请稍后...."
      });
      $timeout(function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          $ionicLoading.hide();
          $scope.msg = "";
          var cardCode = imageData.text;                                  // 扫到的数据
          if (cardCode != '') {
            $.ajax({
              url: $rootScope.interfaceUrl + "getStoreInfoByQRcode",
              type: "POST",
              data: {
                "token": token,
                "qrCode": cardCode
              },
              success: function (result) {
                 //alert(result.msg+" "+result.storeName+" "+result.storeId+" "+result.storeImgUrl);
                if (result.code == '200') {
                  $state.go("tab.payment", {
                          qrCode: cardCode,
                          storeName: result.storeName,
                          storeId: result.storeId,
                          storeImgUrl: result.storeImgUrl,
                          cardId: $scope.cardId
                        });
                } else {
                  $ionicPopup.alert({
                    title: '温馨提示',
                    template: result.msg
                  });
                }
              }
            });
          }
        }, function (error) {
          console.log("An error happened -> " + error);
        });

      },1000);
    };
  })


//调到向商家付款的页面
  .controller('paymentController', function ($scope, $state, $stateParams, $rootScope, $ionicLoading, $ionicPopup) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }

    //页面信息初始化
    $scope.qrCode = $stateParams.qrCode;
    $scope.storeName = $stateParams.storeName;
    $scope.storeId = $stateParams.storeId;
    $scope.storeImgUrl = $stateParams.storeImgUrl;
    $scope.cardId = $stateParams.cardId;

    $scope.paymentMethod=function(amount) {
      $scope.msg = '';
      var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,3})?$/;

      //金额必须大于0的数字..痛苦 0_o||
      if (!reg.test(amount)) {
        $scope.msg = '输入金额不合法，请重新输入！！';
        $("input[name='amount']").val("");
      } else {
        if (parseFloat(amount) <= 0) {
          $scope.msg = '输入金额不合法，请重新输入！！';
          $("input[name='amount']").val("");
        }else {
          $.ajax({
            url: $rootScope.interfaceUrl + "customerWithdraw",
            type: "POST",
            data: {
              "token": token,
              "qrCode": $stateParams.qrCode,
              "amount":amount,
              "cardId": $stateParams.cardId
            },
            success: function (result) {
              //alert(result.msg+" "+result.storeName+" "+result.cardBalance+" "+"支付成功");
              if (result.code == '200') {
                $state.go("tab.userPaymentSuccess", {
                  storeName: result.storeName,
                  amount: result.amount,
                  cardBalance: result.cardBalance,
                  "type": "payment"
                });
              } else {
                $ionicPopup.alert({
                  title: '温馨提示',
                  template: result.msg
                });
              }
            }
          });

        }
      }
    }

  })


  /*
   * Desc 充值页面
   * Author LN
   * Date 2016-12-12
   * */
  .controller('rechargeCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading) {
    //页面信息初始化
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    $scope.isAuthToOthers  =$stateParams.isAuthToOthers;
    $scope.isAuthToMe  =$stateParams.isAuthToMe;

    //单选按钮初始化
    $scope.ret = {choice: '100'};
    $scope.alipay=function (choice) {
      $.ajax({
          url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
          // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
          type:"POST",
          data: {
            "paymentType": "aliPay",
            "cardId": "213213123",
            "subject": "库胖-充值",
            "totalFee": "0.01",
            "body": "充值"
          },
          success: function(result){
            console.log(result.payInfo);
            //第二步：调用支付插件
            cordova.plugins.AliPay.pay(result.payInfo, function success(e){
              // alert("成功了："+e.resultStatus+"-"+e.result+"-"+e.memo);
            }, function error(e){
              // alert("失败了："+e.resultStatus+"-"+e.result+"-"+e.memo);
            });
          }
        });
    };

    $scope.weiXin=function (choice) {
      $.ajax({
          url: $rootScope.interfaceUrl+"uniformOrder", // wxPrepayOrder
          // url: "http://cloudcard.ngrok.joinclub.cn/cloudcard/control/uniformOrder", // wxPrepayOrder
          type:"POST",
          data: {
            "paymentType": "wxPay",
            "cardId": "213213123",
            "totalFee": parseFloat(1) * 100,              // 微信金额不支持小数，这里1表示0.01
            "body": "库胖-充值",           // 标题不能使用中文
            "tradeType":"APP"
          },
          success: function(result){
            console.log(result);
            //第二步：调用支付插件
            wxpay.payment(result, function success (e) {
                // alert("成功了："+e);
            }, function error (e) {
                // alert("失败了："+e);
            });
          }
        });

    };

  })

;

