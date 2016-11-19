angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array
   var chats;
   var that = this;


     $.ajax({
        type: "GET",
        url: "http://192.168.0.107:8080/cloudcard/control/myCloudCards",
        async: false,
        data: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbG91ZGNhcmQiLCJkZWxlZ2F0b3JOYW1lIjoiZGVmYXVsdCIsImV4cCI6MTQ4MDA1NTgwMCwidXNlciI6IkNDMTAwMDAiLCJpYXQiOjE0Nzg3NTk4MDB9.razjBCaXNa3rLsS_-kF8YglW4I01VteRClvpC0TbnPs"},
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
                cardCode: o.cardCode
              }});
        },
        error:function (e) {
         alert("aaaa"+e);
         console.log(e);
       }
     });






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

.factory('CardDetail', function() {
  // Might use a resource here that returns a JSON array
   // var chats;
   //  $.ajax({
   //     type: "GET",
   //     url: "http://192.168.1.106:8080/cloudcard/control/test",
   //     data: {"idToFind":"10001"},
   //     // dataType: "json",
   //     dataFilter: function(data){
   //        console.log("raw data: "+data);
   //        var idx =  data.indexOf("//");
   //        if(data && /^\s*\/\/.*/.test(data) && idx>-1){
   //          data = data.substring(idx+2);
   //        }
   //        return data;
   //     },
   //     success: function(data){
   //       alert("i'm here!!!!");
   //       console.log(data);
   //         chats = [{
   //          id: data.id,
   //          name: data.name,
   //          lastText: data.lastText,
   //          face: data.face
   //        }]
   //     },
   //     error:function (e) {
   //      alert("aaaa"+e);
   //      console.log(e);
   //    }
   //  });



  // Some fake testing data
  chats = [{
    id: 0,
    name: '沙龙_l001_1',
    lastText: '122',
    face: '2016-11-1'
  }, {
    id: 1,
    name: '奶茶_l002_1',
    lastText: '80',
    face: '2016-11-2'
  }, {
    id: 2,
    name: '新白鹿_l003_1',
    lastText: '333',
    face: '2016-11-2'
  }, {
    id: 3,
    name: '奶茶_l002_1',
    lastText: '500',
    face: '2016-11-3'
  },  {
    id: 3,
    name: '新白鹿_l003_1',
    lastText: '500',
    face: '2016-11-3'
  }, {
    id: 3,
    name: '新白鹿_l003_1',
    lastText: '200',
    face: '2016-11-3'
  }, {
    id: 3,
    name: '回头客',
    lastText: '600',
    face: '2016-11-3'
  },{
    id: 4,
    name: '一品鲜_l003_1',
    lastText: '310',
    face: '2016-11-3'
  }];

  return {
    all: function() {
      // alert(chats);
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
    }
  };
});
