angular.module('bill.services', [])
  .service("billService", function ($q, $rootScope) {
    return {
      getUserPaymentBybizService: function () {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "getUserPaymentBybiz",
            type: "POST",
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "viewIndex": 0,
              "viewSize": 20
            },
            success: function (result) {
              console.log(result.code);
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
