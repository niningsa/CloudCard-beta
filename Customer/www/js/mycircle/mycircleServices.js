angular.module('mycircle.services', [])
  .service("mycircleServices", function ($q, $rootScope,$state) {
    return {
      // 我的圈子
      myGroupList: function () {
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

      //这里是下一个方法的开始
    }
  })
