angular.module('chongzhi.services', [])
  .service('chongzhiService', function ($q, $rootScope,$cordovaFileTransfer) {
    return {
      //无卡充值
      teleNumberRecharge:function(teleNumber,amount) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token=$.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        //ajax请求
        $.ajax({
          url: $rootScope.interfaceUrl + "bizByTeleNumberRecharge",
          type: "POST",
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            "teleNumber": teleNumber,
            "amount": amount
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
