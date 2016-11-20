angular.module('starter.services', [])

.factory('Chats', function($rootScope) {
   var chats;
   var that = this;
   var token=$.cookie("token");
   // if(token){
     $.ajax({
        type: "POST",
        url: $rootScope.interfaceUrl+"myCloudCards",

        async: false,
        data: {"token": token},
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
            var cloudCardList = data.cloudCardList||[];
            that.chats= $.map(cloudCardList, function(o){
              return {
                cardId: o.cardId,
                cardName: o.cardName,
                cardBalance: o.cardBalance,
                cardImg: o.cardImg,
                cardCode: o.cardCode,
                isAuthToMe: o.isAuthToMe,
                isAuthToOthers: o.isAuthToOthers

              }});
        },
        error:function (e) {
         console.log(e);
       }
     });
   // }else{
   //   location.href="http://"+location.host+"/#/login";
   // }


  return {
    all: function() {
      console.table(that.chats );
      //console.table(that.chats[0].lastText );
      return that.chats;
    },
    remove: function(chat) {
      that.chats.splice(that.chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < that.chats.length; i++) {
        if (that.chats[i].id === parseInt(chatId)) {
          return that.chats[i];
        }
      }
      return null;
    }
  };
})

//用户账单列表数据
.factory('CardDetail', function($rootScope) {
    var chats;
    var that = this;
    var token=$.cookie("token");
    var organizationPartyId=$.cookie("organizationPartyId");
    // if(token){
    $.ajax({
      type: "POST",
      url: $rootScope.interfaceUrl+"getUserPayment",
      async: false,
      data: {"token": token,
             "organizationPartyId": organizationPartyId,
             "viewIndex":0,
             "viewSize":20},
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
        var paymentList = data.paymentList||[];
        that.chats= $.map(paymentList, function(o){
          return {
            storeName: o.storeName,
            cardBalance: o.amount,
            type: o.type,
            typeDesc: o.typeDesc,
            transDate: o.transDate

          }});
      },
      error:function (e) {
        console.log(e);
      }
    });

  return {
    all: function() {
      // alert(chats);
      return that.chats;
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

;
