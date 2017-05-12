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
  .controller('myShopDetailCtrl', function ($scope,$state,$rootScope,applySellerService,$ionicPopup,myShopDetailService,$cordovaImagePicker,$cordovaFileTransfer) {
    var organizationPartyId = $.cookie("organizationPartyId");
    myShopDetailService.selectMyShopDetail().success(function (data) {
      console.log(data);
      $scope.storeName=data.storeName;
      $scope.storeAddress=data.storeAddress;
      $scope.storeImg=data.storeImg;
      $scope.ossUrl=data.ossUrl;
      $scope.storeInfoImgList=data.storeInfoImgList;
    }).error(function (data) {


    });

    $scope.selectPhoto = function () {
      var options = {
        maximumImagesCount: 9,
        width: 800,
        height: 800,
        quality: 100
      };
      //通过使用流的方式来上传，会出现兼容性的问题
      //$cordovaImagePicker.getPictures(options)
      //  .then(function (results) {
      //    $scope.imageSrcList = results;
      //    for (var i = 0; i < results.length; i++) {
      //      applySellerService.uploadFile(results[i]).success(function (data) {
      //        //alert("图片上传成功："+data.code);
      //      });
      //
      //    }
      //    //var alertPopup = $ionicPopup.alert({
      //    //    title: '成功',
      //    //    template: "图片上传成功"
      //    //  });
      //  }, function (error) {
      //    // error getting photos
      //  });
      //通过插件的方式进行上传图片
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $scope.imageSrcList = results;
          for (var i = 0; i < results.length; i++) {
            document.addEventListener('deviceready', function () {
              var url = $rootScope.interfaceUrl+"bizUploadStoreInfoImg?organizationPartyId="+organizationPartyId;
              var options = {
                fileKey:"uploadedFile"};
              $cordovaFileTransfer.upload(url, results[i], options)
                .then(function (result) {
                  //alert("success");
                }, function (err) {
                  //alert("fail");
                }, function (progress) {
                  // constant progress updates
                });
            }, false);
          }
          var alertPopup = $ionicPopup.alert({
                  title: '成功',
                  template: "图片上传成功"
                });
        }, function (error) {
          // error getting photos
        });

    };

    //图片的预览
    $scope.shouBigImage=function(){
      $state.go("showPicture");
    }
  })

//图片预览
  .controller('showPictureCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService) {
    myShopDetailService.selectMyShopDetail().success(function (data) {
      //console.log(data);
      $scope.ossUrl=data.ossUrl;
      $scope.storeInfoImgList=data.storeInfoImgList;
      console.log( $scope.storeInfoImgList);
    }).error(function (data) {

    });
   //删除图片
    $scope.deletePicture=function(contentId){
      myShopDetailService.deletePictureService(contentId).success(function (data) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
                  title: '成功',
                  template: "图片删除成功"
                });
        $scope.ossUrl=data.ossUrl;
        $scope.storeInfoImgList=data.storeInfoImgList;
      }).error(function (data) {

      });
    }


  })


  //我的消息
  .controller('jiesuanMessageCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService,messageServece) {
    myShopDetailService.listMyHistoryNoteService().success(function (data) {
      console.log(data);
      $scope.partyNotes=data.partyNotes;
    }).error(function (data) {

    });

    //消息已读
    $scope.already=function(noteId){
      messageServece.alreadymessageList(noteId).success(function (data) {
        console.log(data);
        //$scope.messageList=data.partyNotes;
        //location.reload();
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "已读成功"
        });
      });
    }
    //删除
    $scope.deleteMessage=function(noteId){
      messageServece.deleteMessageList(noteId).success(function (data) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "删除成功"
        });
        alertPopup.then(function(res) {
          myShopDetailService.listMyHistoryNoteService().success(function (data) {
            console.log(data);
            $scope.partyNotes=data.partyNotes;
          }).error(function (data) {

          });
          //location.reload();//删除后刷新
        });

      });
    }

  })


  //我的信用
  .controller('myCreditCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService) {
    myShopDetailService.myCreditService().success(function (data) {
      console.log(data);
      $scope.storeLevel=data.storeLevel;
    }).error(function (data) {

    });

  })
