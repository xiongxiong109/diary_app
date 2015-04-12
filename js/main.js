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
			$("#itemContainer").find('li').hide();
			var i=0;
			var pageTimer=setInterval(function(){
				$("#itemContainer").find('li').eq(i).show().addClass('animated fadeInUp');
				i++;
				if(i>10){
					clearInterval(pageTimer);
				}
			},50);
		},
		'panelunload':function(){
			$("#itemContainer").find('li').hide();
		}
	});	
});