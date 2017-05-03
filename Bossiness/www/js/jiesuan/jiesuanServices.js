angular.module('jiesuan.services', [])
  .service('jiesuanService', function ($q, $rootScope,$cordovaFileTransfer) {
    return {
      //付款方 查询待结算(待对方付款)列表
     bizListNeedSettlement:function() {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "bizListNeedSettlement",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "role": "payee"
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
      //收卡/款 方 查询待结算(待对方付款)列表
      fukuanbizListNeedSettlement:function() {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "bizListNeedSettlement",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "role": "payer"
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

      //收款方发起结算的请求
      initiateSettlement:function(paymentId,cardSellerId,tradePartyId,amount,reqCount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "initiateSettlement",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "paymentId":paymentId,
            "payerPartyId":cardSellerId,
            "payeePartyId":tradePartyId,
            "amount": amount,
            "reqCount": reqCount
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
      //付款方的清算
      settlementRequest:function(paymentId,cardSellerId,tradePartyId,amount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "settlementRequest",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "paymentId":paymentId,
            "payerPartyId": cardSellerId,
            "payeePartyId":tradePartyId,
            "amount": amount
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

      //收款方确认清算
      settlementConfirmation:function(paymentId,cardSellerId,tradePartyId,amount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "settlementConfirmation",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "paymentId":paymentId,
            "payerPartyId": cardSellerId,
            "payeePartyId":tradePartyId,
            "amount": amount
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

      //自动清算的时间设定
      bizSetCloudcardSettlementPeriod:function(value,realtime,tradePartyId,cardSellerId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "bizSetCloudcardSettlementPeriod",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "partyIdTo":tradePartyId,
            "partyIdFrom":cardSellerId,
            "week": value,
            "hour":realtime
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
