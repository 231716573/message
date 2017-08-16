//取得url的两个参数
function GetString(name){

	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;

}

var schoolNo = GetString("school_no"), acpa = GetString("acpa"), allUrl = "http://113.98.98.94:8098/";
var thisUrl = location.href;
// console.log(thisUrl)
// 检测重发
var checkName = "", checkTextarea = "";

// datepicker插件
jQuery(function($){   
    $.datepicker.regional['zh-CN'] = {   
        clearText: '清除',   
        clearStatus: '清除已选日期',   
        closeText: '关闭',   
        closeStatus: '不改变当前选择',   
        prevText: '上个月',   
        prevStatus: '显示上个月',   
        prevBigText: '<<',   
        prevBigStatus: '显示上一年',   
        nextText: '下个月',   
        nextStatus: '显示下个月',   
        nextBigText: '>>',   
        nextBigStatus: '显示下一年',   
        currentText: '今天',   
        currentStatus: '显示本月',   
        monthNames: ['一月','二月','三月','四月','五月','六月', '七月','八月','九月','十月','十一月','十二月'],   
        monthNamesShort: ['一','二','三','四','五','六', '七','八','九','十','十一','十二'],   
        monthStatus: '选择月份',   
        yearStatus: '选择年份',   
        weekHeader: '周',   
        weekStatus: '年内周次',   
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],   
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],   
        dayNamesMin: ['日','一','二','三','四','五','六'],   
        dayStatus: '设置 DD 为一周起始',   
        dateStatus: '选择 m月 d日, DD',   
        dateFormat: 'yy-mm-dd',   
        firstDay: 1,   
        initStatus: '请选择日期',   
        isRTL: false
    };   
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});  


$(function (){
	
	$("#form_post").attr("action",allUrl+"/SendExcel.ashx?school_no="+schoolNo+"&acpa="+acpa+"&url="+encodeURIComponent(thisUrl));
	// console.log($("#form_post").attr("action"));

	// 加载一级栏目
	$.getJSON(allUrl+"/GetVenue.ashx?Strvenue=&school_no="+schoolNo+"&acpa="+acpa,function(data){
		// console.log("data:"+JSON.stringify(data))
		if(data.res == 0){	

			var fourtempleLi = "";

			$.each(data.VenueList,function(index,_obj){
				fourtempleLi += '<li class="fourtemple_li"><span venue="'+_obj.Venue+'" onclick="ClassLiVenue(this);"></span>'+_obj.Venue+'<input type="checkbox" onclick="stuLiVenue(this);" /></li>';
			})

			$("#fourtemple").append(fourtempleLi);

		}else{
			alert("发生未知错误，请重新登录！");
		}
	})

	$(".content_choose input").mousedown(function (){
		$(this).css("border-width","2px 0px 0px 2px");
	}).mouseup(function() {
		$(this).css("border-width","0px 2px 2px 0px");
	});

	// 输入留言-字数获取
	$(".content_msg span i").html($(".textarea_msg").val().length);
	$(".textarea_msg").keyup(function (){
		$(".content_msg span i").html($(".textarea_msg").val().length);
	})

	// 查看Excel格式
	$("#form_post .form_post_button").bind('click', function() {
		$(".seeExcel").show();
	});
	$(".seeExcel_div_p2 input").bind('click', function() {
		$(".seeExcel").hide();
	});
	$(".form_post_file").bind('click', function() {
		$(".form_post_submit").removeAttr('disabled');
	});

	$(".textarea_msg").bind("keyup",function(){
		// console.log($(".textarea_msg").val().length)

		if( $(".textarea_msg").val().length<10 || $(".textarea_msg").val().length > 500){
			$("#content_send").attr("disabled","disabled")
		}else{
			$("#content_send").removeAttr('disabled')
		}
	})

	// 点击发送
	$("#content_send").click(function (){

		sendMessage();
	})

	// 确定按钮
	$("#select_sure").click(function() {
		$("#select").hide();
		$("#hadSelect").html($(".select_class_div2 ul li").length);

	});
	// 取消按钮
	$("#select_close").click(function() {
		$("#select").hide();
		$(".select_class_div1 ul").html('<li class="checkLiLength"></li>')
		$(".select_class_div2 ul").empty();
		$("#fourtemple input").removeAttr('checked');
		checkLiLength();
	});
	// 选择班级按钮
	$(".content_choose input").click(function() {
		$("#select").show();
	});
	// 搜索按钮
	$("#imgSearch").bind("click",function (){
		$(".select_class_div1 ul").html('<li class="checkLiLength"></li>')
		$(".select_class_div2 ul").empty();
		$("#fourtemple input").removeAttr('checked');

		searchVenue();
	})


	$("#datepicker").datepicker();

	
	// 集体往右
	$("#clickClass_p1").click(function(){
		$(".select_class_div1 ul li").not(".checkLiLength").each(function(){

		    $(".select_class_div2 ul").append($(this));

		});
		checkLiLength();
	})
	// 选择往右
	$("#clickClass_p2").click(function(){
		$(".select_class_div1 ul li").not(".checkLiLength").each(function(){

		    if($(this).hasClass("bgc")){
		    	$(".select_class_div2 ul").append($(this));
		    }
		   	
		});
		checkLiLength();
	})
	// 选择往左
	$("#clickClass_p3").click(function(){
		$(".select_class_div2 ul li").each(function(){

		    if($(this).hasClass("bgc")){
		    	$(".checkLiLength").before($(this));
		    }
		});
		checkLiLength();
	})
	// 集体往左
	$("#clickClass_p4").click(function(){
		$(".select_class_div2 ul li").each(function(){

		    $(".checkLiLength").before($(this));

		});
		checkLiLength();
	})
	// 清除全部
	$("#clickClass_p5").click(function(){
		$(".select_class_div1 ul").html('<li class="checkLiLength"></li>')
		$(".select_class_div2 ul").empty();
		$("#fourtemple input").removeAttr('checked');
		checkLiLength();
	})
	

})

//检测待选择、已选择里面选择li的内容时的背景色
function checkWaitLiClick(){
	$(".select_class_div1 ul li").not(".checkLiLength").unbind("click").bind("click",function() {
		$(this).toggleClass("bgc");
	});
	$(".select_class_div2 ul li").unbind("click").bind("click",function() {
		$(this).toggleClass("bgc");
	});
}

// 检测待选择、已选择的li的长度
function checkLiLength(){
	//检测待选择
	if($(".select_class_div1 ul li").html()){
		$("#waitClass .select_class_p_head span").html($(".select_class_div1 ul li").length-1)
	}else{
		$("#waitClass .select_class_p_head span").html("0")
	}
	//检测已选择
	if($(".select_class_div2 ul li").html()){
		$("#selectClass .select_class_p_head span").html($(".select_class_div2 ul li").length)
	}else{
		$("#selectClass .select_class_p_head span").html("0")
	}
}

// 月跟日少于10，加0
function dateAddZero(s){
	if(s < 10){
		return "0" + s;
	}else{
		return s;
	}
}

// 默认留言发送时间
var oldDate = new Date();
$("#datepicker").val(oldDate.getFullYear() + "-" + dateAddZero(parseInt(oldDate.getMonth())+1) + "-" + dateAddZero(oldDate.getDate()) )
$(".choose_time_hour").val( dateAddZero(oldDate.getHours()) )
$(".choose_time_minute").val( dateAddZero(oldDate.getMinutes()) )

// 加载图
function loading(bol){
	if(bol){
		$("#loading").show();
	}else{
		$("#loading").hide();
	}
}


// 科目-班级列表
function ClassLiVenue(obj){

	$(obj).toggleClass('fourtemple_li_bgp');
    $(obj).parent().next("ul").stop().slideToggle();
	
	if($(obj).attr("loadTrue") == undefined){
		// console.log("this:"+obj.getAttribute("venue"))
		$(obj).attr("loadTrue",true);
    	loading(true);

		var url = allUrl + "/GetVenue.ashx?Strvenue="+obj.getAttribute("venue")+"&school_no="+schoolNo+"&acpa="+acpa;
		// console.log("url:"+url)

		var that = $(obj);

		$.getJSON(url,function(data){

			// console.log("data:"+JSON.stringify(data));
			if(data.res == 0){	

				var dataUl = '<ul class="templeClass">';

				if($(obj).siblings("input").get(0).checked){

					$.each(data.VenueList,function(index,_obj){

						var thisVenue = obj.getAttribute("venue")+'-'+_obj.Venue;

						if(_obj.Venue.indexOf("20") < 0){

							dataUl += '<li class="templeClassLi"><span venue="'+obj.getAttribute("venue")+'-'+_obj.Venue+'" onclick="ClassLiVenue(this)"></span>'+_obj.Venue+'<input type="checkbox" onclick="stuLiVenue(this)" checked /></li>';
						}else{

							dataUl += '<li class="templeClassLi">'+_obj.Venue+'<input type="checkbox" onclick="stuLiVenue(this)" checked /></li>';
						}
					})
					
				}else{
						
					$.each(data.VenueList,function(index,_obj){

						var thisVenue = obj.getAttribute("venue")+'-'+_obj.Venue;

						if(_obj.Venue.indexOf("20") < 0){

							dataUl += '<li class="templeClassLi"><span venue="'+obj.getAttribute("venue")+'-'+_obj.Venue+'" onclick="ClassLiVenue(this)"></span>'+_obj.Venue+'<input type="checkbox" onclick="stuLiVenue(this)" /></li>';
						}else{

							dataUl += '<li class="templeClassLi">'+_obj.Venue+'<input type="checkbox" onclick="stuLiVenue(this)" /></li>';
						}
					})
				}

				dataUl += '</ul>';
				// console.log("dataUl:"+dataUl);
				that.parent().after(dataUl);

			}

			loading(false);
		})
	}
}

// 学生列表
function stuLiVenue(obj){

	if(obj.checked){
		loading(true);

		$(obj).parent().next("ul").find('input').prop('checked',true);
		var url = allUrl + "/GetsTudent.ashx?Strvenue="+$(obj).siblings('span').attr("venue")+"&school_no="+schoolNo+"&acpa="+acpa;
		// console.log("url:"+url)
		$.getJSON(url,function(data){
			// console.log("stuLiVenue-data:"+JSON.stringify(data))
			if(data.res == 0){
				var div1Ul = document.getElementById("checkUl");

				var abc = ""
				$.each(data.VenueList,function(index,_obj){

					if(div1Ul.innerHTML.indexOf(_obj.name+' '+_obj.tel) < 0){
						if(abc.indexOf(_obj.name+' '+_obj.tel) < 0){
							abc += '<li studentId="'+_obj.student_no+'">'+_obj.name+' '+_obj.tel+'</li>';
						}
					}
					
				})
				// console.log(abc)

				$(".checkLiLength").before(abc);
				
				checkWaitLiClick();
				checkLiLength();
			}
			loading(false);
		})
	}else{
		$(obj).parent().next("ul").find('input').removeAttr('checked');
	}

}

// 发送短信
function sendMessage(){
	loading(true);

	// 多选框按钮点击判断
	if($("#choose_time").get(0).checked){
		// 判断日历是否正确
		if( /^20[1-3]\d\-(0[1-9]|1[0-2])\-([0-2]\d|3[0-1])$/.test($("#datepicker").val()) == false ){
			alert("请填写正确日期");
			return false;
		}
		// 判断小时是否正确
		if( /^((0\d)|([1-9])|(1\d)|(2[0-4]))$/.test($(".choose_time_hour").val()) == false ){
			alert("请填写正确时间");
			return false;
		}
		// 判断分钟是否正确
		if( /^(([0-5]\d)|([1-9]))$/.test($(".choose_time_minute").val()) == false ){
			alert("请填写正确时间");
			return false;
		}

		var textDate = $("#datepicker").val()+" "+$(".choose_time_hour").val()+":"+$(".choose_time_minute").val();
		// console.log("textDate1:"+textDate);

	}else{
		var thisDate = new Date();

		var riqi = thisDate.getFullYear() + "-" + dateAddZero(parseInt(thisDate.getMonth())+1) + "-" + dateAddZero(thisDate.getDate());
		var xiaoshi = dateAddZero(thisDate.getHours());
		var fenzhong = dateAddZero(thisDate.getMinutes());

		var textDate = riqi+" "+xiaoshi+":"+fenzhong;
		// console.log("textDate2:"+textDate);

	}

	var textareaMsg = $(".textarea_msg").val();
	
	var ii = 0;
	var studentNo = "";

	$(".select_class_div2 ul li").each(function (i){
		var stuid = $(this).attr("studentid");

		if(ii > 0){
			studentNo += ",";
		}

		studentNo += stuid;

		ii++;

	})
	textareaMsg = encodeURIComponent(textareaMsg);

	var url = allUrl + "/SendSMS.ashx?";

	url += "school_no="+schoolNo+"&acpa="+acpa+"&summary="+textareaMsg+"&text_date="+textDate+"&TheRecipient="+studentNo;

	// console.log("url:"+studentNo);

	if(studentNo == ""){

		alert("请选择发送对象");
		loading(false);
		return false;

	}else{

		// console.log("checkTextarea1:"+checkTextarea);
		// console.log("checkName1:"+checkName);
		if(checkTextarea == textareaMsg && checkName == studentNo){
			alert("短信已经发送过了");
			loading(false);
			return false;
		}

		$.getJSON(url,function (data){
			if(data.res == 0){
				alert("发送成功");

				checkTextarea = textareaMsg;
				checkName = studentNo;

				// console.log("checkTextarea2:"+checkTextarea);
				// console.log("checkName2:"+checkName);
			}else{
				alert("发送失败");
			}
			loading(false);
		})

	}

}

// 搜索按钮
function searchVenue(){
	loading(true);

	if($("#inputSearch").val().length <= 3){
		alert("请至少输入4位电话号码长度");
		loading(false);
		return false;
	}

	var url = allUrl + "/GetsTudent.ashx?Strvenue="+$("#inputSearch").val()+"&school_no="+schoolNo+"&acpa="+acpa+"&isselect=1";

	$.getJSON(url,function(data){
		// console.log("searchVenue-data:"+JSON.stringify(data));
		if(data.res == 0){
			var div1Ul = document.getElementById("checkUl");

			$.each(data.VenueList,function(index,_obj){

				if(div1Ul.innerHTML.indexOf(_obj.name+' '+_obj.tel) < 0){
					$(".checkLiLength").before('<li studentId="'+_obj.student_no+'">'+_obj.name+' '+_obj.tel+'</li>');
				}
				
			})
			
			checkWaitLiClick();
			checkLiLength();
			loading(false);
		}else{
			alert("没有找到相应的数据");
			loading(false);
			return false;
		}
	})
}