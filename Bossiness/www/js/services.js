angular.module('starter.services', [])

.factory('Chats', function($rootScope, $state) {
  var chats;
  return {
    all: function(amountType) {
        var token=$.cookie("token");
        var organizationPartyId=$.cookie("organizationPartyId");

        if(token){
          $.ajax({
            type: "post",
            url: $rootScope.interfaceUrl+"getBizPayment",
            async: false,
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "type":amountType,  //0-全部， 1-充值，2-支付
              "viewIndex":0,
              "viewSize":200
            },
            success: function(data){
              console.log(data);
              if(data.code=='200'){
                var paymentList = data.paymentList||[];
                chats= $.map(paymentList, function(o){
                  return {
                    customerName: o.customerName,
                    amount: o.amount,
                    typeDesc: o.typeDesc,
                    type: o.type,
                    transDate: o.transDate
                  }
                });
              }
            },
            error:function (e) {
              console.log(e);
            }
        });
        }else{
          $state.go("login");
        }

      return chats;
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
    },
    selects: function(type) {
      return _.filter(chats, function(o) { return o.type==type;});
    }
  };
})

;
