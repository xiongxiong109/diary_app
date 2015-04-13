// 自制分页插件
;(function($){

	$.fn.extend({
		'page':function(options){
			var that=$(this);
			var defaults={
				container:'#itemContainer',	//内容容器
				prev:'上一页',
				next:'下一页',
				perpage:5,
				animation:'fadeInLeft',
				delay:200
			}

			var options=$.extend(defaults,options);

			var oPre,oNext,oP,currentPage,pageTotal;

			currentPage=1;
			
			var len=$( options.container ).children().length;
			pageTotal=Math.ceil( len / options.perpage );
			that.each(function(){
				//show init
				showPage(1);
			});
			function showPage(whichPage){
				oPre=$("<a href='javascript:;' id='perv'>"+options.prev+"</a>");
				oNext=$("<a href='javascript:;' id='next'>"+options.next+"</a>");
				// prev
				oPre.on('click',function(){
					currentPage--;
					if(currentPage<1){
						currentPage=pageTotal;
					}else if(currentPage>pageTotal){
						currentPage=1;
					}
					showPage(currentPage);
				});
				// next
				oNext.on('click',function(){
					currentPage++;
					if(currentPage>pageTotal){
						currentPage=1;
					}else if(currentPage<1){
						currentPage=pageTotal;
					}
					showPage(currentPage);
				});
				currentPage=whichPage;
				oP=$("<span>"+currentPage+'/'+pageTotal+"页</span>");
				$( options.container ).children().hide().removeClass('animated '+options.animation);
				var cnt=options.perpage*(whichPage-1);
				var start=cnt;
				clearInterval(that.timer);
				that.timer=setInterval(function(){
					if(cnt>= ( start+options.perpage ) ){
						clearInterval(that.timer);
					}else{
						$( options.container ).children().eq(cnt).show().addClass('animated '+ options.animation);
					}
					cnt++;
				},options.delay);
				//添加
				that.html('').append(oPre).append(oP).append(oNext);
			}
		}
	})

})(jQuery);

$.afui.autoLaunch=false;
$.afui.useOSThemes=false;
$(function(){
	$.afui.clearHistory();
	$.afui.launch();
	//swipe轮播图
	var mySwiper = new Swiper('.swiper-container',{
	  pagination: '.pagination',
	  loop:true,
	  grabCursor: true,
	  paginationClickable: true,
	  autoplay:1500,
	  autoplayDisableOnInteraction:false
	});
	$(".swiper-container").height( $(".swiper-slide img").height() );
	$(window).on('resize',function(){
		$(".swiper-container").height( $(".swiper-slide img").height() );
	});

	// timeline时间轴
	$(".cbp_tmtimeline").find('li').hide().show().addClass('animated bounceInUp');
	
	//分页
	$("#read").on({
		'panelload':function(){
			$("div.holder").page({
				perpage:10,
				delay:80
			});
			var num=0;
			var timer=null;
			var len=$("#itemContainer").find('li').length;
			timer=setInterval(function(){
				num++
				$("#total").text(num);
				if(num>=len){
					clearInterval(timer);
				}
			},30);

		},
		'panelunload':function(){
			$("#itemContainer").find('li').hide();
			$("#total").text(0);
		}
	});	
});