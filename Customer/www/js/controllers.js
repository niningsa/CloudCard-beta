angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //

  $scope.chats = Chats.all();
    alert( $scope.chats[0].lastText);
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chatId = $stateParams.chatId;
  $scope.lastText = $stateParams.lastText;
    alert($scope.chatId);
  //$scope.chat = Chats.get($stateParams.chatId);
  //  console.table($scope.chat );
  // alert(jQuery('#output'));
   jQuery('#output').qrcode("http:/'./jetienne.com?stateParams="+$stateParams.chatId);

  //  jQuery('#output').qrcode({
  //     render: "table", //table方式
  //     width: 200, //宽度
  //     height:200, //高度
  //     text: "www.helloweba.com" //任意内容
  // });
})


.controller('inputCtrl', function($scope, $stateParams, Chats) {
  // $scope.chat = Chats.get($stateParams.cardId);
   // alert($stateParams.cardId);
   $scope.cardId  =$stateParams.cardId;
   $scope.lastText  =$stateParams.lastText;
  // alert($scope.cardId);
  $("body").off("click").on("click","#powerfrom", function() {
    $other_tel=$("#other_tel").val();
    $other_money=$("#other_money").val();
    $other_startDate=$("#other_startDate").val();
    $other_endDate=$("#other_endDate").val();
    if ($other_endDate == null | $other_endDate ==''){
        var nowtime = new Date();
        $other_endDate = nowtime.toLocaleDateString().replace('/','-').replace('/','-');
    }
    $own_cardID=$("#own_cardID").val();
    // alert($other_endDate);
    // alert($scope.name)
    var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
     var flag =true;
    if (!phoneReg.test($other_tel)) {

          flag = false;
     };
     var moneyReg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
     if (moneyReg.test($other_money)) {
        if(parseInt(other_money) > parseInt($scope.lastText)){
          alert("授权金额大于可用金额");
          flag = false;
        }
     }else{
          alert("金额输入有误,请重新");
          flag = false;
     };
    if(flag){
    $.post("#/tab/getpowers",
      {'other_tel':$other_tel,
        'cardId':$stateParams.cardId,
        'other_money':$other_money,
        'other_startDate':$other_startDate,
        'other_endDate':$other_endDate,
        'own_cardID':$own_cardID},
        function(date){
          if(date.mes=='success'){
            alert("成功");
          }else if(date.mes=='error'){
            alert("失败");
          }else{
             $other_tel="";
             $other_money="";
             $other_startDate="";
             $other_endDate="";
             // alert("测试用的，可以删除");
            window.location.href="#/tab/cardreturn"
          }

        })
    };
  });
})


.controller('CardDetailCtrl', function($scope,CardDetail) {
 $scope.cardDetail = CardDetail.all();
 // alert($scope.cardDetail);
});
