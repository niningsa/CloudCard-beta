angular.module('starter.services', [])

.factory('Chats', function($rootScope,$state,$ionicPopup) {



  return {
    all: function() {
      var chats = [];
      var token=$.cookie("token");
      if(token){
      $.ajax({
        type: "POST",
        //url: "http://121.40.214.81:8080/cloudcard/control/myCloudCards",先给写死，暂解燃眉之极
        url:$rootScope.interfaceUrl+"myCloudCards",
        async: false,
        data: {
          "token": token,
          "viewIndex": 0,
          "viewSize": 200
        },
        // dataType: "json",
        dataFilter: function(data){
          console.log("raw data: "+data);
          var idx =  data.indexOf("//");
          if(data && /^\s*\/\/.*/.test(data) && idx>-1){
            data = data.substring(idx+2);
          }
          return data;
        },
        success: function(data){
          chats = data.cloudCardList||[];
        },
        error:function (e) {
          console.log(e);
          $ionicPopup.alert({
            title:"温馨提示",
            template:"手机网络已中断，请尝试开启网络!!",
            okText:"确定",

          })

        }
      });
      }else{
        $state.go("login");
      }
      console.table(chats );
      //console.table(that.chats[0].lastText );
      return chats;
    }
  };
})

//用户账单列表数据
.factory('CardDetail', function($rootScope,$state,$ionicPopup) {

  return {
    all: function(amountType,viewSize) {
      var token=$.cookie("token");
      //alert(viewSize);
      var organizationPartyId=$.cookie("organizationPartyId");
      if(token!=null) {
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "getUserPayment",
          async: false,
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "type":amountType,  //0-全部， 1-充值，2-支付
            "viewIndex": 0,
            "viewSize": viewSize
          },
          // dataType: "json",
          //dataFilter: function (data) {
          //  console.log("raw data: " + data);
          //  var idx = data.indexOf("//");
          //  if (data && /^\s*\/\/.*/.test(data) && idx > -1) {
          //    data = data.substring(idx + 2);
          //  }
          //  return data;
          //},
          success: function (data) {
            var paymentList = data.paymentList || [];
            cardDetail = $.map(paymentList, function (o) {
              return {
                storeName: o.storeName,
                cardBalance: o.amount,
                type: o.type,
                typeDesc: o.typeDesc,
                transDate: o.transDate

              }
            });
          },
          error: function (e) {
            $ionicPopup.alert({
              title:"温馨提示",
              template:"手机网络已中断，请尝试开启网络!!",
              okText:"确定",

            })
          }
        });
      }else{
        $state.go("login");
      }
      console.table(cardDetail );
      return cardDetail;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(cardId,amountType) {
      var token=$.cookie("token");
      var organizationPartyId=$.cookie("organizationPartyId");
      if(token!=null) {
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "getUserPayment",
          async: false,
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "type":amountType,  //0-全部， 1-充值，2-支付
            "cardId":cardId,
            "viewIndex": 0,
            "viewSize": 2000
          },
          // dataType: "json",
          dataFilter: function (data) {
            console.log("raw data: " + data);
            var idx = data.indexOf("//");
            if (data && /^\s*\/\/.*/.test(data) && idx > -1) {
              data = data.substring(idx + 2);
            }
            return data;
          },
          success: function (data) {
            var paymentList = data.paymentList || [];
            cardDetail = $.map(paymentList, function (o) {
              return {
                storeName: o.storeName,
                cardBalance: o.amount,
                type: o.type,
                typeDesc: o.typeDesc,
                transDate: o.transDate

              }
            });
          },
          error: function (e) {
            $ionicPopup.alert({
              title:"温馨提示",
              template:"手机网络已中断，请尝试开启网络!!",
              okText:"确定",

            })
          }
        });
      }else{
        $state.go("login");
      }
      console.table(cardDetail );
      return cardDetail;
    }
  };
})


.factory("getCode",function () {
  //
  var check = function(tel){
    console.log(tel+"123123");
  };

  return {
    getYZM:function (tel) {
      return check(tel);
    }
  };

})

  .factory('mycards', function() {
    // Some fake testing data
    //cards = [{
    //  cardId:1000,
    //  storeId:1,
    //  storeName: '沙龙_l001_1',
    //  cardName: '南塘包子铺',
    //  cardBalance: '352',
    //  qrCode: '18772115070',
    //  storeImgUrl: 'img/yinhanka.png'
    //}, {
    //  cardId:1001,
    //  storeId:2,
    //  storeName: '奶茶_l002_1',
    //  cardName: '大庆包子铺',
    //  cardBalance: '425',
    //  qrCode: '18772114254',
    //  storeImgUrl: 'img/yinhanka2.png'
    //}];

    return {
      all: function() {
        // alert(chats);
        return cards;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });


;
