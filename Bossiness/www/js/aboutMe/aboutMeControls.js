angular.module('aboutMe.controllers', [])

  /********************************************* Start 圈子 **************************************************/
  /*
   * Desc 圈子账单
   * Author LN
   * Date 2017-1-12
   * */
  .controller('aboutMeCtrl', function ($scope,myShopDetailService) {
    myShopDetailService.selectMyShopDetail().success(function (result) {
      $scope.storeSaleLevel=result.storeSaleLevel;
    });

  })
  /*
   * Desc 我的店铺的具体信息
   * Author LN
   * Date 2017-1-12
   * */
  .controller('myShopDetailCtrl', function ($scope,$state,$rootScope,$stateParams,applySellerService,$ionicPopup,myShopDetailService,$cordovaImagePicker,$cordovaFileTransfer,$ionicLoading) {
    var organizationPartyId = $.cookie("organizationPartyId");
    myShopDetailService.selectMyShopDetail().success(function (data) {
      $scope.storeName=data.storeName;
      $scope.legalId=data.legalId;
      $scope.storeAddress=data.storeAddress;
      $scope.legalName=data.legalName;
      $scope.legalTeleNumber=data.legalTeleNumber;
      $scope.storeSaleLevel=data.storeSaleLevel;
      $scope.aliPayAccount=data.aliPayAccount;
      $scope.aliPayName=data.aliPayName;
      $scope.wxPayAccount=data.wxPayAccount;
      $scope.wxPayName=data.wxPayName;
      $scope.storeImg=data.storeImg;
      $scope.ossUrl=data.ossUrl;
      $scope.bizLicImgList=data.bizLicImgList;
      $scope.bizAvatarImgList=data.bizAvatarImgList;
      $scope.bizDetailsList=data.bizDetailsList;
      if(data.storeSaleLevel ==='STORE_SALE_LEVEL_2'){
        $scope.codeBtnDisable = true;
      }
      $scope.reqType = $stateParams.reqType;
      if($stateParams.reqType === 'details'){
        $scope.btnText='更新店铺信息';
      }else if($stateParams.reqType === 'apply'){
        $scope.btnText='申请二级商家';
      }
    }).error(function (data) {


    });

    $scope.bizCreateApplyVIP = function () {
      $scope.codeBtnDisable = false;//防止二次点击
      myShopDetailService.bizCreateApplyVIP(
        $scope.storeName,
        $scope.legalId,
        $scope.legalName,
        $scope.storeAddress,
        $scope.aliPayAccount,
        $scope.aliPayName,
        $scope.wxPayAccount,
        $scope.wxPayName,
        $scope.reqType
      ).success(function (data) {
        $ionicLoading.hide();
        if(data.reqType === 'apply'){
          var alertPopup = $ionicPopup.alert({
            title: '申请成功',
            template: '恭喜您申请成功，请耐心等待平台审核。'
          });
        }else if(data.reqType === 'details'){
          var alertPopup = $ionicPopup.alert({
            title: '修改成功',
            template: '店铺信息更新成功。'
          });
        }
      }).error(function (data) {

      });
    }

    $scope.selectPhoto = function (storeImgType) {
      var maximumImagesCount;
      if(storeImgType === 'bizLic' || storeImgType === 'bizAvatar'){
        maximumImagesCount = 1;
      }else{
        maximumImagesCount = 9;
      }
      var options = {
        maximumImagesCount: maximumImagesCount,
        width: 800,
        height: 800,
        quality: 100
      };
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          if(storeImgType === 'bizLic'){
            $scope.bizLicImageSrcList = results;
          }else if(storeImgType === 'bizAvatar'){
            $scope.bizAvatarImageSrcList = results;
          }else if(storeImgType === 'bizDetails'){
            $scope.bizDetailsImageSrcList = results;
          }
          for (var i = 0; i < results.length; i++) {
            document.addEventListener('deviceready', function () {
              var url = $rootScope.interfaceUrl+"bizUploadStoreInfoImg?organizationPartyId="+organizationPartyId+"&storeImgType="+storeImgType;
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
    $scope.shouBigImage=function(storeImgType){
      $state.go('showPicture',{storeImgType:storeImgType});
    };
  })

  //图片预览
  .controller('showPictureCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService,$stateParams) {
    myShopDetailService.selectMyShopDetail().success(function (data) {
      $scope.ossUrl=data.ossUrl;
      if($stateParams.storeImgType === 'bizLic'){
        $scope.storeInfoImgList=data.bizLicImgList;
      }else if($stateParams.storeImgType === 'bizAvatar'){
        $scope.storeInfoImgList=data.bizAvatarImgList;
      }else if($stateParams.storeImgType === 'bizDetails'){
        $scope.storeInfoImgList=data.bizDetailsList;
      }

    }).error(function (data) {

    });

   //删除图片
    $scope.deletePicture=function(contentId){
      myShopDetailService.deletePictureService(contentId).success(function (data) {
        var alertPopup = $ionicPopup.alert({
              title: '成功',
              template: "图片删除成功"
            });
        $scope.ossUrl=data.ossUrl;
        if($stateParams.storeImgType === 'bizLic'){
          $scope.storeInfoImgList=data.bizLicImgList;
        }else if($stateParams.storeImgType === 'bizAvatar'){
          $scope.storeInfoImgList=data.bizAvatarImgList;
        }else if($stateParams.storeImgType === 'bizDetails'){
          $scope.storeInfoImgList=data.bizDetailsList;
        }
      }).error(function (data) {

      });
    };


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

  //关于我们
  .controller('aboutUsCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService) {

  })
  //关于库胖
  .controller('aboutCloudCardCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService) {

  })

  //我的信用
  .controller('myCreditCtrl', function ($scope,$ionicPopup,$state,$rootScope,myShopDetailService) {
    myShopDetailService.myCreditService().success(function (data) {
      console.log(data);
      $scope.storeLevel=data.storeLevel;
    }).error(function (data) {

    });

  })
