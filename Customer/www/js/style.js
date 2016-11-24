$(function(){
     //时间的控制
  $("body").on("click", "#other_startDate", function(){
    var today = new Date().toLocaleDateString().replace('/','-').replace('/','-');
    $(this).attr("min", today);
  }).on("change","#other_startDate",function(){
    var $other_endDate=$("#other_endDate");
    var minDate = $("#other_startDate").val().replace('/','-').replace('/','-');
    $other_endDate.attr("min",minDate);
  });

})
