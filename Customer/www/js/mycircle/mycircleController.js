angular.module('mycircle.controllers', [])

  .controller('circleListCtrl', function($scope,$state, $rootScope,mycircleServices) {

    /*
     * Desc 这里是查询附近圈子和店铺的列表
     * Author WK
     * Date 2017-3-13
     * */
    mycircleServices.myGroupList().success(function (result) {
      $scope.storeList=result.storeList;

      })


    })

