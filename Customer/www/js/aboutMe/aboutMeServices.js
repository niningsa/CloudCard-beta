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
      //总帐单
      billList:function(amountType){
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
            "type":amountType,  //0-全部， 1-充值，2-支付
            "viewIndex": 0,
            "viewSize": 2000
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
      //分帐单
      subBillService:function(amountType,cardId){
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
            "type":amountType,  //0-全部， 1-充值，2-支付
            "cardId":cardId,
            "viewIndex": 0,
            "viewSize": 2000
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
      getUesrInfoService:function(){
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
        var organizationPartyId=$.cookie("organizationPartyId");
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "getUesrInfo",
          async: false,
          data: {
            "token": token,
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
     //更改个人信息
      updateInformationService:function(userName,teleNumber){
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
        var organizationPartyId=$.cookie("organizationPartyId");
        $.ajax({
          type: "POST",
          url: $rootScope.interfaceUrl + "updateUesrInfo",
          async: false,
          data: {
            "token": token,
            "userName": userName
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
