angular.module('shoukuan.services', [])
  .service('shoukuanSellerService', function ($q, $rootScope,$cordovaFileTransfer) {
    return {
      //查询客户的卡列表
      selectCustomerCardList: function (qrcode) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId=$.cookie("organizationPartyId");
        //ajax请求
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "getCloudcardsOfUser",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "qrCode":qrcode
            },
            success: function (result) {
              console.log(result);
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
      //通过手机号查询该客户是否有卡，有卡就显示卡
      selectCustomerCard: function (teleNumber, amount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        //ajax请求
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "getCloudcardsOfUser",
            type: "POST",
            data: {
              "token": token,
              "teleNumber": teleNumber,
              "amount":amount
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
      noCardShouKuan:function(teleNumber,cardId,cardCode,amount,identifyCode) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        //ajax请求
        $.ajax({
          url: $rootScope.interfaceUrl + "bizByTeleNumberWithdraw",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "teleNumber": teleNumber,
            "cardId": cardId,
            "cardCode": cardCode,
            "amount": amount,
            "captcha": identifyCode
          },
          success: function (result) {
            console.log(result);
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
