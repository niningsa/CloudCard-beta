angular.module('circle.services', [])

  .service("myCircleServece", function ($q, $rootScope) {
    return {
      // 我的圈子
      bizMyGroup: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizMyGroup",
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

      // 商家创建圈子
      bizCreateGroup: function (groupName) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizCreateGroup",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "groupName": groupName
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

      // 邀请商家加入圈子
      bizSentGroupInvitation: function (teleNumber) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizSentGroupInvitation",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "teleNumber": teleNumber
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

      // 查看店铺简要信息（如 点击圈友列表中的圈友）
      bizGetStoreInfo: function (storeId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizGetStoreInfo",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "storeId": storeId
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

      // 圈主解散圈子
      bizDissolveGroup: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizDissolveGroup",
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

      // 接收/拒绝 加入圈子的邀请
      bizAcceptGroupInvitation: function (invitation, partyInvitationId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizAcceptGroupInvitation",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "partyInvitationId": partyInvitationId,
              "isAccept": invitation
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

      // 圈友退出圈子
      bizExitGroup: function (storeId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizExitGroup",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "storeId": storeId
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

      // 圈主冻结/解冻 圈友(冻结后 不允许再接收圈主的卡消费 )
      bizFreezeGroupPartner: function (storeId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizFreezeGroupPartner",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "storeId": storeId
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
      }
    };
  })


  .service("amountService", function ($q, $rootScope) {
    return {
      // 圈主发起结算，需要等待圈友确认结算后，才会生效
      bizDoSettlement: function (storeId, settlementAmount, actualSettlementAmount) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizDoSettlement",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "storeId": storeId,
              "settlementAmount":settlementAmount,
              "actualSettlementAmount": actualSettlementAmount
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

      // 获取待确认结算信息
      bizGetUnconfirmedSettlementInfo: function (storeId) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizGetUnconfirmedSettlementInfo",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "storeId": storeId
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

      // 圈友确认结算
      bizSettlementConfirm: function (settlementId, isConfirm) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizSettlementConfirm",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "settlementId":settlementId,
              "isConfirm": isConfirm
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

      // 催款，提醒圈主进行结算
      bizSettlementRequest: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizSettlementRequest",
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
      }

    };
  });
