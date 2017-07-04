angular.module('starter.services', [])

  .factory('Chats', function ($rootScope, $state) {
    var chats;
    return {
      all: function (amountType) {
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");

        if (token) {
          $.ajax({
            type: "post",
            url: $rootScope.interfaceUrl + "getBizPayment",
            async: false,
            data: {
              "token": token,
              "organizationPartyId": organizationPartyId,
              "type": amountType,  //0-全部， 1-充值，2-支付
              "viewIndex": 0,
              "viewSize": 200
            },
            success: function (data) {
              console.log(data);
              if (data.code == '200') {
                var paymentList = data.paymentList || [];
                chats = $.map(paymentList, function (o) {
                  return {
                    customerName: o.customerName,
                    amount: o.amount,
                    typeDesc: o.typeDesc,
                    type: o.type,
                    transDate: o.transDate
                  }
                });
              }
            },
            error: function (e) {
              console.log(e);
            }
          });
        } else {
          $state.go("login");
        }

        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      },
      selects: function (type) {
        return _.filter(chats, function (o) {
          return o.type == type;
        });
      }
    };
  })

  .factory('Banks', function () {

    var Banks = [{
      id: 'BC',
      name: '中国银行',
      lastText: '值得信赖',
      face: 'img/bank/zhongh.png'
    }, {
      id: 'CBC',
      name: '中国建设银行',
      lastText: '值得信赖',
      face: 'img/bank/jh.png'
    }, {
      id: 'ICBC',
      name: '中国工商银行',
      lastText: '值得信赖',
      face: 'img/bank/gs.png'
    }, {
      id: 'CMB',
      name: '中国招商银行',
      lastText: '值得信赖',
      face: 'img/bank/zs.png'
    }, {
      id: 'ABC',
      name: '中国农业银行',
      lastText: '值得信赖',
      face: 'img/bank/nh.png'
    }, {
      id: 'PSBC',
      name: '中国邮政储蓄',
      lastText: '值得信赖',
      face: 'img/bank/youc.png'
    }];

    return {
      all: function () {
        return Banks;
      }
    };
  })

  .service('applySellerService', function ($q, $rootScope,$cordovaFileTransfer) {
    return {
      getCurrentPosition: function () {
        //开始获取定位数据
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        //定位数据获取成功响应
        function onSuccess(position) {
          // alert('纬度: ' + position.coords.latitude + '\n' +
          //   '经度: ' + position.coords.longitude + '\n' +
          //   '海拔: ' + position.coords.altitude + '\n' +
          //   '水平精度: ' + position.coords.accuracy + '\n' +
          //   '垂直精度: ' + position.coords.altitudeAccuracy + '\n' +
          //   '方向: ' + position.coords.heading + '\n' +
          //   '速度: ' + position.coords.speed + '\n' +
          //   '时间戳: ' + position.timestamp + '\n');

          localStorage.setItem('latitude', position.coords.latitude);
          localStorage.setItem('longitude', position.coords.longitude);
        }

        //定位数据获取失败响应
        function onError(error) {
          alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        }
      },
      applySellerRegister: function (businessName, phone, businessUserName, identifyCode) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var latitude = localStorage.getItem('latitude');
        var longitude = localStorage.getItem('longitude');
        //ajax请求
        $.ajax(
          {
            url: $rootScope.interfaceUrl + "bizCreateApply",
            type: "POST",
            data: {

              "latitude":latitude,
              "longitude":longitude,
              "storeName": businessName,
              "teleNumber": phone,
              "captcha": identifyCode
            },
            success: function (result) {
              if (result.code === '200') {
                deferred.resolve(result.msg);
              } else {
                deferred.reject(result.msg);
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
      //查询点击的二维码
      shopQrcode: function () {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var token = $.cookie("token");
        var organizationPartyId = $.cookie("organizationPartyId");
        //ajax请求
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
      //通过流的方式从相册选择图片上传,会出现兼容性的问题
      //uploadFile: function(fileUrl) {
      //  var deferred = $q.defer();
      //  var promise = deferred.promise;
      //  function getBase64(img) {
      //    function getBase64Image(img, width, height) {
      //      var canvas = document.createElement("canvas");
      //      canvas.width = width ? width : img.width;
      //      canvas.height = height ? height : img.height;
      //      var ctx = canvas.getContext("2d");
      //      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //      var dataURL = canvas.toDataURL();
      //      return dataURL;
      //    }
      //
      //    var image = new Image();
      //    image.crossOrigin = '';
      //    image.src = img;
      //    var deferred = $.Deferred();
      //    if (img) {
      //      image.onload = function () {
      //        deferred.resolve(getBase64Image(image));
      //      }
      //      return deferred.promise();
      //    }
      //  }
      //
      // //将dataurl转换成blob二进制数据
      //  function dataURLtoBlob(dataurl) {
      //    alert(dataurl);
      //    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      //      //bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      //      bstr=atob(arr[1]),n=bstr.length,
      //      aBuffer=new ArrayBuffer(n);
      //    var uBuffer = new window.Uint8Array(aBuffer);
      //    while (n--) {
      //      uBuffer[n] = bstr.charCodeAt(n);
      //    }
      //    var blob=null;
      //    try{
      //      blob = new Blob([uBuffer], {type : mime});
      //    }
      //    catch(e){
      //      window.BlobBuilder = window.BlobBuilder ||
      //        window.WebKitBlobBuilder ||
      //        window.MozBlobBuilder ||
      //        window.MSBlobBuilder;
      //      if(e.name == 'TypeError' && window.BlobBuilder){
      //        var bb = new window.BlobBuilder();
      //        bb.append(uBuffer.buffer);
      //        blob = bb.getBlob(mime);
      //      }
      //      else if(e.name == "InvalidStateError"){
      //        blob = new Blob([aBuffer], {type : mime});
      //      }
      //      else{
      //
      //      }
      //    }
      //    return blob;
      //
      //  }
      //  getBase64(fileUrl).then(function (base64) {
      //    var bfile = dataURLtoBlob(base64);
      //    alert("我进来了"+bfile);
      //    //var deferred = $.Deferred();
      //    //var promise = deferred.promise;
      //    fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
      //    mimeType = bfile.type;
      //    var organizationPartyId = $.cookie("organizationPartyId");
      //    var formdata = new FormData();
      //    formdata.set("uploadedFile", bfile);
      //    formdata.set("_uploadedFile_fileName", fileName);
      //    formdata.set("_uploadedFile_contentType", mimeType);
      //    //formdata.set("organizationPartyId", organizationPartyId);
      //
      //    $.ajax(
      //      {
      //        url: $rootScope.interfaceUrl + "upload",
      //        //url: $rootScope.interfaceUrl + "bizUploadStoreInfoImg",
      //        type: "POST",
      //        data: formdata,
      //        contentType: false,
      //        cache: false,
      //        processData: false,
      //        success: function (result) {
      //          alert(result.code);
      //          deferred.resolve(result);
      //          if (result.code == '200') {
      //            deferred.resolve(result);
      //          } else {
      //            deferred.reject(result);
      //          }
      //        }
      //      });
      //    promise.success = function (fn) {
      //      promise.then(fn);
      //      return promise;
      //    };
      //    promise.error = function (fn) {
      //      promise.then(null, fn);
      //      return promise;
      //    };
      //    return promise;
      //  }, function (err) {
      //    console.log(err);
      //  });
      //  promise.success = function (fn) {
      //    promise.then(fn);
      //    return promise;
      //  };
      //  promise.error = function (fn) {
      //    promise.then(null, fn);
      //    return promise;
      //  };
      //  return promise;
      //
      //},
      //无卡确认付款

    }
  })

;
