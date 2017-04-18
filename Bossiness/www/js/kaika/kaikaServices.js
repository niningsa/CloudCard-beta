angular.module('kaika.services', [])
  .service('kaikaService', function ($q, $rootScope,$cordovaFileTransfer) {
    return {
      //无卡充卡
      teleNumberActivate:function(teleNumber,amount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        $.ajax({
          url: $rootScope.interfaceUrl + "activateCloudCardAndRecharge",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "teleNumber": teleNumber,
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
      //已开卡账单查询列表
      activateCardBillService: function (cardNumber,ownerPartyId,cardId,amountType) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId=$.cookie("organizationPartyId");
        //ajax请求
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "getUserPaymentBybiz",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "cardNumber": cardNumber,
              "ownerPartyId": ownerPartyId,
              "cardId": cardId,
              "type":amountType  //0-全部， 1-充值，2-支付
            },
            success: function (result) {
              //console.log(result);
              deferred.resolve(result);
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
      //已开卡的列表查询
      activateCardListService: function () {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId=$.cookie("organizationPartyId");
        //ajax请求
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "getCloudCardByBiz",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId
            },
            success: function (result) {
              //console.log(result);
              deferred.resolve(result);
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
