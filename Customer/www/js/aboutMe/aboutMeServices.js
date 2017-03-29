angular.module('aboutMe.services', [])
  .service("aboutMeService", function ($q, $rootScope,$state) {
    return {
      // 我的圈子
      bizMyGroup: function () {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;

         $.ajax(
           {
             url: $rootScope.interfaceUrl + "getUserLevelAndScore",
             type: "POST",
             data: {
               "token": token
             },
             success: function (result) {
               console.log(result);
               deferred.resolve(result);
               if (result.code == '200') {
                 deferred.resolve(result);
               }else {
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
      billList:function(){
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
        var organizationPartyId=$.cookie("organizationPartyId");
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "getUserPayment",
          async: false,
          data: {
            "token": token,
            "organizationPartyId": organizationPartyId,
            //"type":amountType,  //0-全部， 1-充值，2-支付
            "viewIndex": 0,
            "viewSize": 20
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

      //这里是下一个方法的开始
    }
    })
