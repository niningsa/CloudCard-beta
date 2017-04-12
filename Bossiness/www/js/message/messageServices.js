angular.module('message.services', [])
  .service("messageServece", function ($q, $rootScope) {
    return {
      messageList: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "listMyNote",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId
            },
            success: function (result) {
              console.log(result);
              if (result.code == '200') {
                deferred.resolve(result);
              } else {
                deferred.reject(result);
              }
            }
          });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      alreadymessageList: function (noteId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "readMyNote",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "noteId": noteId,
              "isViewed": 'Y'
            },
            success: function (result) {
              console.log(result);
              if (result.code == '200') {
                deferred.resolve(result);
              } else {
                deferred.reject(result);
              }
            }
          });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      //删除消息列表
      deleteMessageList: function (noteId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "deleteMyNote",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "noteId": noteId,
              "removed": 'Y'
            },
            success: function (result) {
              console.log(result);
              if (result.code == '200') {
                deferred.resolve(result);
              } else {
                deferred.reject(result);
              }
            }
          });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
    }
  })
