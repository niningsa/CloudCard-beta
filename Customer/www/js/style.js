$(function(){
     //时间的控制 min方法去约定时间时是有时间格式的限制，格式是'2016-05-07'
  $("body").on("click", "#other_startDate", function($filter){
    //var today = new Date().toLocaleDateString().replace('/','-').replace('/','-');
     var today = new Date();
      var y = today.getFullYear();
      var m = today.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = today.getDate();
      d = d < 10 ? ('0' + d) : d;
      var days= y + '-' + m + '-' + d;
      $(this).attr("min", days);

  }).on("change","#other_startDate",function(){
    var $other_endDate=$("#other_endDate");
    var minDate = $("#other_startDate").val();
    $other_endDate.attr("min",minDate);
  });

})
