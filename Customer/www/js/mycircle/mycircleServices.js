angular.module('mycircle.services', [])
  .service("mycircleServices", function ($q, $rootScope,$state) {
    return {
      // 我的圈子
      myGroupList: function (storeName,countyGeoId) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
        navigator.geolocation.getCurrentPosition(function (data) {
          //if(token){
            $.ajax(
              {
                url: $rootScope.interfaceUrl + "userStoreListLBS",
                type: "POST",
                data: {
                  "token": token,
                  "storeName": storeName,
                  "countyGeoId": countyGeoId,
                  "longitude": data.coords.longitude,
                  "latitude": data.coords.latitude
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
          //}else{
          //  $state.go("login");
          //}
       }, function (error) {
        alert("网络不可用，请打开网络!!");
        console.log(error);

      }, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000, coorType: 'bd09ll'})


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

      //根据店铺Id查询该店铺的详细的信息
      shopDetailByStoreId: function (storeId) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;

        $.ajax(
          {
            url: $rootScope.interfaceUrl + "userGetStoreInfo",
            type: "POST",
            data: {
              "token": token,
              "storeId":storeId
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
      //根据店铺Id查询该客户是否拥有该店铺的卡
      selectShopCard: function (storeId) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
        if (token) {
          $.ajax(
            {
              url: $rootScope.interfaceUrl + "getCardAndStoreInfoByStoreId",
              type: "POST",
              data: {
                "token": token,
                "storeId": storeId
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
        } else {
          $state.go("login");
        }


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
