angular.module('bill.controllers', [])

  //B端账单
  .controller('billHomeCtrl', function ($scope,billService) {
    //账单类型
    $scope.billTypeList=[
      {id:1,type:1,text:'总充值'},
      {id:2,type:4,text:'本店收本店'},
      {id:3,type:3,text:'本店收他店'},
      {id:4,type:5,text:'他店收本店'},
      {id:5,type:2,text:'本店已开卡'}
    ];

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
