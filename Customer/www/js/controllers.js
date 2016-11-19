angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$stateParams) {

    $scope.teleNumber = $stateParams.teleNumber;
    $scope.amount = $stateParams.amount;
    $scope.fromDate = $stateParams.fromDate;
    $scope.thruDate = $stateParams.thruDate;
  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //

  $scope.chats = Chats.all();
    //alert( $scope.chats[0].lastText);
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.cardId = $stateParams.cardId;
    $scope.cardBalance = $stateParams.cardBalance;
    $scope.cardName = $stateParams.cardName;
    $scope.cardCode  =$stateParams.cardCode;
    //alert($stateParams.chatId);
    //alert($scope.lastText);
  //$scope.chat = Chats.get($stateParams.chatId);
  //  console.table($scope.chat );
  // alert(jQuery('#output'));
  //  将客户的cardCode放入生成的二维码中
   jQuery('#output').qrcode($stateParams.cardCode);

  //  jQuery('#output').qrcode({
  //     render: "table", //table方式
  //     width: 200, //宽度
  //     height:200, //高度
  //     text: "www.helloweba.com" //任意内容
  // });
})

//授权的controller
.controller('inputCtrl', function($scope, $stateParams, Chats) {
   $scope.cardId  =$stateParams.cardId;
   $scope.cardBalance  =$stateParams.cardBalance;
   $scope.cardName  =$stateParams.cardName;

  $("body").off("click").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_cardId=$("#other_cardId").val();
    $other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();
    if ($other_endDate == null | $other_endDate ==''){
        var nowtime = new Date();
        $other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
    }

    //验证手机号是否合法
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
     var flag =false;
    if (!phoneReg.test($other_tel)) {
      alert("请输入正确的手机号码");
          flag = false;
     }

    //正则验证输入金额是否合法
     var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
     if (moneyReg.test($other_money)) {
        if(parseInt($other_money) > parseInt($scope.cardBalance)){
          alert("授权金额大于可用金额");
          flag = false;
        }
     }else{
          alert("金额输入有误,请重新输入");
          flag = false;
     };
    if(flag){
      $.ajax({
        type: "POST",
        url: "http://192.168.0.107:8080/cloudcard/control/createCardAuth",
        async: false,
        data: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbG91ZGNhcmQiLCJkZWxlZ2F0b3JOYW1lIjoiZGVmYXVsdCIsImV4cCI6MTQ4MDA1NTgwMCwidXNlciI6IkNDMTAwMDAiLCJpYXQiOjE0Nzg3NTk4MDB9.razjBCaXNa3rLsS_-kF8YglW4I01VteRClvpC0TbnPs",
          "cardId":$other_cardId,
          "teleNumber":$other_tel,
          "amount":$other_money,
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
          //授权成功，传入必要的参数，跳转到授权成功的查看页面
          window.location.href="#/tab/cardreturn/"+$other_tel+"/"+$other_money+"/"+$other_startDate+"/"+$other_endDate;
        },
        error:function (e) {
          console.log(e);
          window.location.href="#/tab/cardinput";
        }
      });

    };
  });
})


.controller('CardDetailCtrl', function($scope,CardDetail) {
 $scope.cardDetail = CardDetail.all();
});
