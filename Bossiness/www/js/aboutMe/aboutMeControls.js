angular.module('aboutMe.controllers', [])

  /********************************************* Start 圈子 **************************************************/
  /*
   * Desc 圈子账单
   * Author LN
   * Date 2017-1-12
   * */
  .controller('aboutMeCtrl', function ($scope) {

  })
  /*
   * Desc 我的店铺的具体信息
   * Author LN
   * Date 2017-1-12
   * */
  .controller('myShopDetailCtrl', function ($scope,applySellerService,$ionicPopup,myShopDetailService,$cordovaImagePicker,$cordovaFileTransfer) {
    myShopDetailService.selectMyShopDetail().success(function (data) {
      console.log(data);
      $scope.storeName=data.storeName;
      $scope.storeAddress=data.storeAddress;
      $scope.storeImg=data.storeImg;
    }).error(function (data) {


    });

    $scope.selectPhoto = function () {
      var options = {
        maximumImagesCount: 9,
        width: 800,
        height: 800,
        quality: 100
      };
      //通过插件的方式来上传
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $scope.imageSrcList = results;
          for (var i = 0; i < results.length; i++) {
            applySellerService.uploadFile(results[i]).success(function (data) {
              //alert("图片上传成功："+data.code);
            });

          }
          //var alertPopup = $ionicPopup.alert({
          //    title: '成功',
          //    template: "图片上传成功"
          //  });
        }, function (error) {
          // error getting photos
        });

    };
  })
