angular.module('circle.controllers', [])

/********************************************* Start 圈子 **************************************************/
  /*
   * Desc 圈子账单
   * Author LN
   * Date 2017-1-12
   * */
  .controller('circeAccountCtrl', function ($scope) {

  })

  /*
   * Desc 圈友催款页面
   * Author LN
   * Date 2017-1-12
   * */
  .controller('settleLayoutCtrl', function ($scope, amountService) {
      $scope.bizSettlementRequest = function () {
        amountService.bizSettlementRequest().success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '成功',
            template: data.msg
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
   * Date 2017-1-12
   * */
  .controller('settleModalCtrl', function ($scope, $rootScope, myCircleServece, amountService) {
    $scope.closeModal = function () {
      $scope.modal.hide();
    };


    $scope.bizDoSettlement = function (actualSettlementAmount) {
      myCircleServece.bizGetStoreInfo($scope.storeId).success(function (data) {
        alert(actualSettlementAmount+" "+data.storeId+" "+data.settlementAmount);

        amountService.bizDoSettlement(data.storeId, data.settlementAmount, actualSettlementAmount).success(function (data) {

        });
      });
    };
  })

  /*
   * Desc 圈友详情
   * Author LN
   * Date 2017-1-12
   * */
  .controller('circleInfoCtrl', function ($scope, $state, $ionicModal, $stateParams, $rootScope, $ionicPopup, myCircleServece) {
    $scope.storeId = $stateParams.storeId;                    // 圈友ID
    $scope.isGroupOwner = $stateParams.isGroupOwner;       // 是否是圈主

    if($scope.isGroupOwner == 'Y'){
      $scope.myObj = {"width" : "49%"};
    }

    // 查看店铺简要信息
    myCircleServece.bizGetStoreInfo($scope.storeId).success(function (data) {
      $scope.storeName = data.storeName;			            // 店名
      $scope.storeId = data.storeId;					            // 店铺id
      $scope.storeImg = data.storeImg; 				            // 店铺图片地址
      $scope.storeAddress = data.storeAddress;            // 店铺地址
      $scope.storeTeleNumber = data.storeTeleNumber;			// 店铺联系电话（店主电话）
      $scope.settlementAmount = data.settlementAmount;		// 待结算金额
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
    $scope.bizExitGroup = function (storeId, isGroupOwner) {
      if(isGroupOwner == 'Y'){ // 圈主踢出圈友时， 必须先对该圈友进行冻结, 然后结清未结算金额
        $scope.bizFreezeGroupPartner(storeId);

      }else{                   // 圈友主动发起退出操作的场景， 若有未结算金额时，也会给出错误提示。
        myCircleServece.bizExitGroup(storeId).success(function (data) {
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
      }
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
    $ionicModal.fromTemplateUrl('templates/circle/settleModal.html', function (modal) {
      $scope.modal = modal;
    }, {
      animation: 'slide-in-up',
      focusFirstInput: true,
      scope: $scope
    });
    $scope.openSettle = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
  })


  /*
   * Desc 圈友消费详情
   * Author LN
   * Date 2017-2-26
   * */
  .controller('myCircleCtrl', function ($scope, $state, $stateParams, $ionicPopup, myCircleServece) {
    $scope.circleName  =$stateParams.circleName;
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }

    // 我的圈子info
    myCircleServece.bizMyGroup().success(function (data) {
      console.log(data);
      $scope.isJoinGroup	= data.isJoinGroup;		         	              // 是否已加入圈子
      $scope.isGroupOwner = data.isGroupOwner;	         	              // 是否为圈主
      $scope.groupName = data.groupName;		                            // 圈主名

      $scope.crossStoreAmount = data.crossStoreAmount;		              // 跨店消费额，圈主卡 到 圈友店 消费总额，
      $scope.presellAmount = data.presellAmount;		                    // 已卖卡总额，圈主卖出的卡总金额
      $scope.totalConsumptionAmount = data.totalConsumptionAmount;      // 已消费总额，圈主本店消费 + 到圈友店里跨店消费，
      $scope.balance = data.balance;					                          // 剩余额度，剩余卖卡额度，
      $scope.income = data.income;						                          // 收益总额，因为跨店消费的圈主给圈友的打折而产生的收益总额，
      $scope.partners = data.partners;		                              // 圈友列表
      $scope.invitations = data.invitations;		                        // 邀请加入圈子的列表，

    });

    myCircleServece.bizGetStoreInfo($.cookie("organizationPartyId")).success(function (data) {
      $scope.settlementAmount = data.settlementAmount;		// 待结算金额
    });

    // 圈主解散圈子
    $scope.bizDissolveGroup = function () {
      myCircleServece.bizDissolveGroup().success(function (data) {
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
          $state.go("tab.myCircle");
        });
      });
    };

    // 接收/拒绝 加入圈子的邀请
    $scope.bizAcceptGroupInvitation = function (invitation, partyInvitationId) {
      myCircleServece.bizAcceptGroupInvitation(invitation, partyInvitationId).success(function (data) {
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
  .controller('circleInvitationCtrl', function ($scope, $state, $ionicPopup, myCircleServece) {
    var token = $.cookie("token");
    if (token == null) {
      $state.go("login");
    }

    $scope.invitationGroup = function(telphone){
      //验证手机号是否合法
      var phoneReg = /^0?1[3|4|5|8][0-9]\d{8}$/;

      if (!phoneReg.test(telphone)) {
        $ionicPopup.alert({
          title:"温馨提示",
          template:"请输入正确的手机号码",
          okText:"确定"
        });
      }else{
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
      }

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
