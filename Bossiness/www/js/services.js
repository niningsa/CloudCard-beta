angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
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
  }, {
    id: 2,
    name: '新白鹿_l003_2',
    lastText: '充值：222',
    face:'2016-11-2',
    type: 'type_2'
  }, {
    id: 3,
    name: '一品鲜_l003_2',
    lastText: '充值：444',
    face:'2016-11-2',
     type: 'type_2'
  }, {
    id: 4,
    name: '回头客_3',
    lastText: '开卡：666',
    face:'2016-11-2',
    type: 'type_3'
  }];

  return {
    all: function() {
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

.factory("cardInfo",function () {

})
;
