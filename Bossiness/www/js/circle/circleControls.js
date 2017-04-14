angular.module('circle.controllers', [])

/********************************************* Start 圈子 **************************************************/
  /*
   * Desc 圈子账单
   * Author ln
   * Date 2017-1-12
   * */
  .controller('circeAccountCtrl', function ($scope) {

  })

  /*
   * Desc 圈友催款页面
   * Author LN
   * Date 2017-1-12
   * */
  .controller('settleLayoutCtrl', function ($scope, $ionicPopup, $state, amountService) {
      var organizationPartyId = $.cookie("organizationPartyId"); // 当前登录商家ID

      // 获取待确认结算信息
      amountService.bizGetUnconfirmedSettlementInfo(organizationPartyId).success(function (data) {
        $scope.settlementInfo = data;     // 待确认结算信息

        // alert($scope.settlementInfo.settlementId+" "+$scope.settlementInfo.settlementAmount);
      });

      // 圈友确认结算
      $scope.bizSettlementConfirm = function (confirm, settlementId) {
        amountService.bizSettlementConfirm(settlementId, confirm).success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '成功',
            template: data.msg
          });
          alertPopup.then(function(res) {
            $state.go("tab.myCircle");
          });
        }).error(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '失败',
            template: data.msg
          });
          alertPopup.then(function(res) {
            $state.go("tab.settleLayout");
          });
        });
      };


      // 催款
      $scope.bizSettlementRequest = function () {
        amountService.bizSettlementRequest().success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '成功',
            template: "催款成功！"
          });
          alertPopup.then(function(res) {
            $state.go("tab.myCircle");
          });
        });
      }
  })

  /*
   * Desc 结算模态框
   * Author LN
   * Date 2017-2-28
   * */
  .controller('settleModalCtrl', function ($scope, $ionicPopup, myCircleServece, amountService) {
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    // 圈主发起结算
    $scope.bizDoSettlement = function (actualSettlementAmount, settlementAmount) {
      // alert($scope.storeId+" "+settlementAmount+" "+actualSettlementAmount);
      amountService.bizDoSettlement($scope.storeId, settlementAmount, actualSettlementAmount).success(function (data) {
        $ionicPopup.alert({
          title: '成功',
          template: data.msg
        });
      }).error(function (data) {
        $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
      });
    };

  })

  /*
   * Desc 圈友详情
   * Author LN
   * Date 2017-2-26
   * */
  .controller('circleInfoCtrl', function ($scope, $state, $ionicModal, $stateParams, $rootScope, $ionicPopup, myCircleServece) {
    $scope.storeId = $stateParams.storeId;                        // 圈友ID
    $scope.isGroupOwner = $stateParams.isGroupOwner;              // 当前登录人是否是圈主
    $scope.organizationPartyId = $.cookie("organizationPartyId"); // 当前登录商家ID

    // alert($.cookie("organizationPartyId")+" "+$scope.storeId+" "+($scope.isGroupOwner == 'Y' && $scope.organizationPartyId == $scope.storeId));

    if($scope.isGroupOwner == 'Y'){
      $scope.myObj = {"width" : "49%"};
    }

    // 查看店铺简要信息
    myCircleServece.bizGetStoreInfo($scope.storeId).success(function (data) {
      $scope.storeName = data.storeName;			            // 店名
      $scope.isFrozen = data.isFrozen;			              // 是否被冻结
      $scope.storeImg = data.storeImg; 				            // 店铺图片地址
      $scope.storeAddress = data.storeAddress;            // 店铺地址
      $scope.storeTeleNumber = data.storeTeleNumber;			// 店铺联系电话（店主电话）
      $scope.settlementAmount = data.settlementAmount;		// 待结算金额
      $scope.isFrozen = data.isFrozen;		                // 冻结状态
      $scope.isGroupOwners = data.isGroupOwner;		        // 此圈友是否是圈主
    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: '失败',
        template: data.msg
      });
      alertPopup.then(function(res) {
        $state.go("tab.myCircle");
      });
    });

    // 退出圈子
    $scope.bizExitGroup = function () {
      // 圈主踢出圈友时， 必须先对该圈友进行冻结, 然后结清未结算金额
      // 圈友主动发起退出操作的场景， 若有未结算金额时，也会给出错误提示。
      if($scope.isGroupOwner == 'Y'){
        // $scope.bizFreezeGroupPartner($scope.storeId);               // 冻结
        myCircleServece.bizGetStoreInfo($scope.storeId);            // 结算
      }

      myCircleServece.bizExitGroup($scope.storeId).success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
      });

    };

    // 圈主冻结/解冻 圈友(冻结后 不允许再接收圈主的卡消费 )
    $scope.bizFreezeGroupPartner = function (storeId) {
      myCircleServece.bizFreezeGroupPartner(storeId).success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
      });
    };

    // 结算单模态框
    $ionicModal.fromTemplateUrl('templates/circle/settleModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    
    $scope.openSettle = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    // 模态框隐藏时，重新查看待清算金额
    $scope.$on("modal.hidden", function() {
      myCircleServece.bizGetStoreInfo($scope.storeId).success(function (data) {
        $scope.settlementAmount = data.settlementAmount;
      });
    });

  })


  /*
   * Desc 圈友主页面
   * Author LN
   * Date 2017-2-26
   * */
  .controller('myCircleCtrl', function ($scope, $state, $ionicPopup, myCircleServece) {
    var token = $.cookie("token");

    if (token == null) {
      $state.go("login");
    }

    // 我的圈子info
    myCircleServece.bizMyGroup().success(function (data) {
      $scope.isJoinGroup	= data.isJoinGroup;		         	              // 是否已加入圈子
      $scope.isGroupOwner = data.isGroupOwner;	         	              // 是否为圈主

      $scope.crossStoreAmount = data.crossStoreAmount;		              // 跨店消费额，圈主卡 到 圈友店 消费总额，
      $scope.presellAmount = data.presellAmount;		                    // 已卖卡总额，圈主卖出的卡总金额
      $scope.totalConsumptionAmount = data.totalConsumptionAmount;      // 已消费总额，圈主本店消费 + 到圈友店里跨店消费，
      $scope.balance = data.balance;					                          // 剩余额度，剩余卖卡额度，
      $scope.income = data.income;						                          // 收益总额，因为跨店消费的圈主给圈友的打折而产生的收益总额，
      $scope.partners = data.partners;		                              // 圈友列表
      $scope.invitations = data.invitations;		                        // 邀请加入圈子的列表，
    });

    // 页面数据展示
    myCircleServece.bizGetStoreInfo($.cookie("organizationPartyId")).success(function (data) {
      $scope.settlementAmount = data.settlementAmount;
      $scope.storeImg = data.storeImg;
      $scope.groupName = data.storeName;
    });

    // 圈主解散圈子
    $scope.bizDissolveGroup = function () {
      myCircleServece.bizDissolveGroup().success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "解散成功！"
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle", {}, {reload: true});
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      });
    };

    // 接收/拒绝 加入圈子的邀请
    $scope.bizAcceptGroupInvitation = function (invitation, partyInvitationId) {
      myCircleServece.bizAcceptGroupInvitation(invitation, partyInvitationId).success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "操作成功！"
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle", {}, {reload: true});      // 原页面跳转，需要刷新
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      });
    };

  })

  /*
   * Desc 邀请商家加入圈子
   * Author LN
   * Date 2017-2-26
   * */
  .controller('circleInvitationCtrl', function ($scope, $state, $ionicPopup, $cordovaContacts, myCircleServece) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }

    // 打开通讯录
    $scope.pickContactUsingNativeUI = function () {
      $cordovaContacts.pickContact().then(function (contactPicked) {
        $scope.contact = contactPicked.phoneNumbers[0].value.replace(/[\s\-]/g,'');
        // alert(JSON.stringify(contactPicked));
        document.getElementById('phoneNums').value = $scope.contact;
      });
    };


    $scope.invitationGroup = function(telphone){
      // 邀请
      myCircleServece.bizSentGroupInvitation(telphone).success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '成功',
          template: "邀请请求发送成功，等待好友确认！"
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.circleInvitation");
        });
      });
    };
  })

  /*
   * Desc 创建我的圈子
   * Author LN
   * Date 2017-1-12
   * */
  .controller('createCircleCtrl', function ($scope, $state, $ionicPopup, myCircleServece) {
    // 商家创建圈子
    $scope.createGroup = function (groupName) {

      myCircleServece.bizCreateGroup(groupName).success(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '创建成功',
          template: '恭喜您创建圈子成功！'
        });
        alertPopup.then(function(res) {
          $state.go("tab.createCircleSuccess");
        });

      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '失败',
          template: data.msg
        });
        alertPopup.then(function(res) {
          $state.go("tab.myCircle");
        });
      });

    };

  });

/********************************************* End 圈子 **************************************************/
