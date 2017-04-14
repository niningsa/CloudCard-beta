angular.module('bill.controllers', [])

  //B端账单
  .controller('billHomeCtrl', function ($scope,billService) {
    billService.getUserPaymentBybizService().success(function (data) {
      $scope.billList=data.paymentList;
    }).error(function (data) {


    });

  })

  //店内消费的账单
  .controller('shopConsumeCtrl', function ($scope) {

  })

 /*  卡内消费

  */
  .controller('cardConsumeCtrl', function ($scope) {

  })
  /*其他消费
  *
  * */
  .controller('otherConsumeCtrl', function ($scope) {

  })
