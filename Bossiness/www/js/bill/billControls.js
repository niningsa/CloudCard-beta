angular.module('bill.controllers', [])

  //B端账单
  .controller('billHomeCtrl', function ($scope,billService) {
    billService.getUserPaymentBybizService(1).success(function (data) {
      //$scope.yearAndMonthPaymentList=data.yearAndMonthPaymentList;
      $scope.paymentsList=data.paymentsList;
      function getTransDateYearMonth(obj){
        var transDate = parseInt(obj.transDate);
        var date = new Date(transDate);
        return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
      }
      $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
      console.log( $scope.list);
    }).error(function (data) {


    });

    //通过类型来分类账单
    $scope.change=function(type){
      billService.getUserPaymentBybizService(type).success(function (data) {
        //$scope.yearAndMonthPaymentList=data.yearAndMonthPaymentList;
        $scope.paymentsList=data.paymentsList;
        function getTransDateYearMonth(obj){
          var transDate = parseInt(obj.transDate);
          var date = new Date(transDate);
          return date.getFullYear() + '年' + (date.getMonth()+1) +'月';
        }
        $scope.list=  _.groupBy($scope.paymentsList, getTransDateYearMonth);
        console.log( $scope.list);
      }).error(function (data) {


      });
    }

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
