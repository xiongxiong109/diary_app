$.afui.autoLaunch=false;
$.afui.useOSThemes=false;
$(function(){
	$.afui.clearHistory();
	$.afui.launch();
	//swipe
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

	// timeline
	$(".cbp_tmtimeline").find('li').hide().show().addClass('animated bounceInUp');

	// panels
	$(".panel").on('panelload',function(){
		
	});
});