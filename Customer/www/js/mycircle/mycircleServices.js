angular.module('mycircle.services', [])
  .service("mycircleServices", function ($q, $rootScope,$state) {
    return {
      // 我的圈子
      myGroupList: function (storeName) {
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
                  //"token": token,
                  //"storeName": storeName,
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
      //根据城市名称来查询城市
      findStoreName: function (storeName,geoId,geoTypeId) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
          $.ajax(
            {
              url: $rootScope.interfaceUrl + "getCloudcardStoreByGeoId",
              type: "POST",
              data: {
                //"token": token,
                "geoId": geoId,
                "geoTypeId": geoTypeId,
                "storeName": storeName
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

      //根据城市名称来查询城市
      cityList: function (area) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;
          $.ajax(
            {
              url: $rootScope.interfaceUrl + "getCityOrAreaByCityName",
              type: "POST",
              data: {
                //"token": token,
                "cityName": area
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

      //根据城市名称来查询下级的城市
      getCityOrAreaByGeoId: function (geo,geoTypeId) {
        var token = $.cookie("token");
        var deferred = $q.defer();
        var promise = deferred.promise;

          $.ajax(
            {
              url: $rootScope.interfaceUrl + "getCityOrAreaByGeoId",
              type: "POST",
              data: {
                //"token": token,
                "geoId": geo,
                "geoTypeId": geoTypeId
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
