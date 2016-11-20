angular.module('starter.services', [])

.factory('Chats', function($rootScope) {

/*
  chats = [{
    id: 0,
    name: '沙龙_l001_1',
    lastText: '消费：200',
    face:'2016-11-2',
    type: 'type_1'
  }, {
    id: 1,
    name: '奶茶_l002_1',
    lastText: '消费：300',
    face:'2016-11-2',
     type: 'type_1'
  }];
*/

  var chats;
  // if(token){
  $.ajax({
    type: "post",
    url: $rootScope.interfaceUrl+"getBizPayment",
    async: false,
    data: {
      "token": $rootScope.token,
      "organizationPartyId":$rootScope.organizationPartyId,
      "type":"0",  //0-全部， 1-充值，2-支付
      "viewIndex":0,
      "viewSize":200
    },
    success: function(data){
      console.log(data.code+" "+data.msg);
      if(data.code=='200'){
        var paymentList = data.paymentList||[];
        chats= $.map(paymentList, function(o){
          return {
            customerName: o.customerName,
            amount: o.amount,
            typeDesc: o.typeDesc,
            transDate: o.transDate
          }
        });
      }

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
      console.table(chats);
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
    select: function(type) {
      return _.filter(chats, function(o) { return o.type==type;});
    }
  };
})

;
