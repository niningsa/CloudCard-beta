angular.module('aboutMe.services', [])

  .service("myShopDetailService", function ($q, $rootScope) {
    return {
      //查询本店的详细的信息
      selectMyShopDetail: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "userGetStoreInfo",
            type: "POST",
            data: {
              "token": token,
              "storeId": organizationPartyId
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
