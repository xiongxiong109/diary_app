// 自制分页插件
;
(function($) {

	$.fn.extend({
		'page': function(options) {
			var that = $(this);
			var defaults = {
				container: '#itemContainer', //内容容器
				prev: '上一页',
				next: '下一页',
				perpage: 5,
				animation: 'fadeInLeft',
				delay: 200
			}

			var options = $.extend(defaults, options);

			var oPre, oNext, oP, currentPage, pageTotal;

			currentPage = 1;

			var len = $(options.container).children().length;
			pageTotal = Math.ceil(len / options.perpage);
			if (pageTotal <= 0) {
				pageTotal = 1;
			}
			that.each(function() {
				//show init
				showPage(1);
			});

			function showPage(whichPage) {
				oPre = $("<a href='javascript:;' id='perv'>" + options.prev + "</a>");
				oNext = $("<a href='javascript:;' id='next'>" + options.next + "</a>");
				// prev
				oPre.on('click', function() {
					currentPage--;
					if (currentPage < 1) {
						currentPage = pageTotal;
					} else if (currentPage > pageTotal) {
						currentPage = 1;
					}
					showPage(currentPage);
				});
				// next
				oNext.on('click', function() {
					currentPage++;
					if (currentPage > pageTotal) {
						currentPage = 1;
					} else if (currentPage < 1) {
						currentPage = pageTotal;
					}
					showPage(currentPage);
				});
				currentPage = whichPage;
				oP = $("<span>" + currentPage + '/' + pageTotal + "页</span>");
				$(options.container).children().hide().removeClass('animated ' + options.animation);
				var cnt = options.perpage * (whichPage - 1);
				var start = cnt;
				clearInterval(that.timer);
				that.timer = setInterval(function() {
					if (cnt >= (start + options.perpage)) {
						clearInterval(that.timer);
					} else {
						$(options.container).children().eq(cnt).show().addClass('animated ' + options.animation);
					}
					cnt++;
				}, options.delay);
				//添加
				that.html('').append(oPre).append(oP).append(oNext);
			}
		}
	})
})(jQuery);
// window.localStorage.clear();
$.afui.autoLaunch = false;
$.afui.useOSThemes = false;
$(function() {
	// 通过以下循环可以获取本地存储的日记总数
	var indexNow = 0;
	while (window.localStorage.getItem('dairy' + indexNow + '-title') != null) {
		indexNow++;
	};

	// 初始化数据
	createContent(indexNow - 1);

	//动态生成node节点
	createNode();
	// 初始化时间轴
	createTimeLine(3);


	$.afui.clearHistory();
	$.afui.launch();

	//swipe轮播图
	var mySwiper = new Swiper('.swiper-container', {
		pagination: '.pagination',
		loop: true,
		grabCursor: true,
		paginationClickable: true,
		autoplay: 1500,
		autoplayDisableOnInteraction: false
	});
	$(".swiper-container").height($(".swiper-slide img").height());
	$(window).on('resize', function() {
		$(".swiper-container").height($(".swiper-slide img").height());
	});

	// timeline时间轴
	$(".cbp_tmtimeline").find('li').hide().show().addClass('animated bounceInUp');
	$("#nav").click(function() {
		$.afui.loadContent('#write', false, false, 'pop');
	})
	$("#moreBtn").click(function() {
		$.afui.loadContent('#read', false, false, 'slide');
	})
	//分页
	$("#read").on({
		'panelload': function() {
			$("div.holder").page({
				perpage: 10,
				delay: 80,
				animation: 'rotateInUpLeft'
			});
			var num = 0;
			var timer = null;
			var len = $("#itemContainer").find('li').length;
			timer = setInterval(function() {
				if (num >= len) {
					clearInterval(timer);
				}
				$("#total").text(num);
				num++;
			}, 30);

		},
		'panelunload': function() {
			$("#itemContainer").find('li').hide();
			$("#total").text(0);
		}
	});

	// swipe切换页面
	$("#read").on('swipeRight', function() {
		$.afui.loadContent('#home', false, false, 'flip');
	});
	$("#write").on('swipeLeft', function() {
		$.afui.loadContent('#home', false, false, 'flip');
	});

	//写页面
	$("#write").on('panelload', function() {
		// 当前时间
		var date = new Date();
		var oYear = date.getFullYear();
		var oMon = date.getMonth() + 1;
		var oDate = date.getDate();
		$("#now").text(oYear + '年' + oMon + '月' + oDate + '日');
		// 百度地图
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(116.331398, 39.897445);
		map.centerAndZoom(point, 12);

		function myFun(result) {
			var cityName = result.name;
			map.setCenter(cityName);
			$("#where").text(cityName);
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myFun);
	});
	$("#artTitle, #content").on({
		'focus': function() {
			$(this).css({
				"border": '1px solid #00c',
				"box-shadow": '0px 0px 15px #00c'
			});
		},
		'blur': function() {
			$(this).css({
				"border": '1px solid #ccc',
				"box-shadow": '0px 0px 0px #000'
			});
		}
	});

	//提交存储
	$("#smt").click(function() {
		if ($("#artTitle").val() == '' || $("#content").val() == '') {
			$.afui.popup({
				title: '且慢~',
				message: '标题和内容不能为空',
				cancelOnly: true,
				cancelText: '好的'
			});
		} else {
			// 写日记
			var date = new Date();
			var oYear = date.getFullYear();
			var oMon = date.getMonth() + 1;
			var oDate = date.getDate();
			var oHours = date.getHours();
			var oMins = date.getMinutes();
			var dairyName = 'dairy' + indexNow;
			var json=getPosition();//获取地理位置
			window.localStorage.setItem(dairyName + '-title', $("#artTitle").val());
			window.localStorage.setItem(dairyName + '-now', $("#now").html());
			window.localStorage.setItem(dairyName + '-where', $("#where").html());
			window.localStorage.setItem(dairyName + '-content', $("#content").val());
			window.localStorage.setItem(dairyName + '-lat',json.lat || 121.4878);
			window.localStorage.setItem(dairyName + '-lon',json.lon || 31.2491);
			// 设置具体的时间，用于时光轴
			window.localStorage.setItem(dairyName + '-clock', oHours + ':' + oMins);
			//清空
			$("#artTitle").val('');
			$("#content").val('');
			$.afui.popup({
				title: '写好了~',
				message: '日记已写好，现在要去查看吗?',
				cancelText: '留在这里',
				doneText: '去看看',
				doneCallback: function() {
					// 添加新节点
					indexNow = 0;
					while (window.localStorage.getItem('dairy' + indexNow + '-title') != null) {
						indexNow++;
					};
					createNode();
					//清除历史记录
					$.afui.clearHistory();
					$.afui.loadContent('#read', false, false, 'slide');
				},
				cancelCallback: function() {
					// 添加新节点
					indexNow = 0;
					while (window.localStorage.getItem('dairy' + indexNow + '-title') != null) {
						indexNow++;
					};
					createNode();
					//清除历史记录
					$.afui.clearHistory();
				}
			});
		}
	});

	//重写
	$("#clc").click(function() {
		$.afui.popup({
			title: "确定要重写吗?",
			cancelText: "算了吧",
			doneText: "重新来过!",
			doneCallback: function() {
				$("#artTitle").val('');
				$("#content").val('');
				$.afui.popup({
					title: "文本内容已清空!",
					cancelOnly: true
				});
			}
		})
	});
	//页面加载刷新
	$('#home').on('panelload', function() {
		createTimeLine(3);
	});
	//创建列表节点

	function createNode() {
		var str = "";
		for (var i = indexNow - 1; i >= 0; i--) {
			str += "<li data-index='" + i + "'>" + "<a href='#readDetail' data-transition='flip'>" + window.localStorage.getItem('dairy' + i + '-' + 'title') + "<time class='diary-time'>" + window.localStorage.getItem('dairy' + i + '-' + 'now') + "</time></a></li>";
		}
		$(".list").html(str);
		// 目录点击事件
		$(".list").find('li').click(function() {
			$.afui.showMask('文章加载中');
			var idx = $(this).attr('data-index');
			createContent(idx);
		});
	}
	//创建文章信息

	function createContent(index) {
		var str = "";
		str += "<h3 id='detailTitle'>" + window.localStorage.getItem('dairy' + index + '-' + 'title') + "</h3>" + "<p id='detialNav'>" + "<time>" + window.localStorage.getItem('dairy' + index + '-' + 'now') + "</time>" + "<span>" + window.localStorage.getItem('dairy' + index + '-' + 'where') + "</span>" + "</p>" + "<p id='detailContent'>" + window.localStorage.getItem('dairy' + index + '-' + 'content') + "</p>" + "<a id='goBack' class='icon left' onclick='$.afui.goBack();'>返回</a>" + "<a href='javascript:;' class='icon close' id='del'></a>";
		$(".content-wrap").html(str);
		var lat=window.localStorage.getItem('dairy' + index + '-' + 'lat');
		var lon=window.localStorage.getItem('dairy' + index + '-' + 'lon');
		// 创建百度地图
		createMap(lat,lon);
		$("#del").click(function() {
			// console.log("index:"+index);
			// console.log("indexNow:"+indexNow);
			$.afui.popup({
				title: "删除文档",
				message: "你确定要删除这段回忆吗?",
				cancelText: "不,留着",
				doneText: "删,难回首",
				doneCallback: function() {
					//删除记录
					$.afui.showMask('心碎的记忆正在随风而去...');
					if (index == (indexNow - 1)) {
						// 如果是最后一篇，就直接删除
						window.localStorage.removeItem('dairy' + index + '-' + 'content');
						window.localStorage.removeItem('dairy' + index + '-' + 'clock');
						window.localStorage.removeItem('dairy' + index + '-' + 'now');
						window.localStorage.removeItem('dairy' + index + '-' + 'title');
						window.localStorage.removeItem('dairy' + index + '-' + 'where');
					} else {
						for (var i = index; i < indexNow; i++) {
							// 用后面的覆盖
							var nextContent = window.localStorage.getItem('dairy' + (parseInt(i) + 1) + '-' + 'content');
							var nextClock = window.localStorage.getItem('dairy' + (parseInt(i) + 1) + '-' + 'clock');
							var nextNow = window.localStorage.getItem('dairy' + (parseInt(i) + 1) + '-' + 'now');
							var nextTitle = window.localStorage.getItem('dairy' + (parseInt(i) + 1) + '-' + 'title');
							var nextWhere = window.localStorage.getItem('dairy' + (parseInt(i) + 1) + '-' + 'where');

							window.localStorage.setItem('dairy' + i + '-' + 'content', nextContent);
							window.localStorage.setItem('dairy' + i + '-' + 'clock', nextClock);
							window.localStorage.setItem('dairy' + i + '-' + 'now', nextNow);
							window.localStorage.setItem('dairy' + i + '-' + 'title', nextTitle);
							window.localStorage.setItem('dairy' + i + '-' + 'where', nextWhere);
						}
						//覆盖完了再删除最后一个
						window.localStorage.removeItem('dairy' + (indexNow - 1) + '-' + 'content');
						window.localStorage.removeItem('dairy' + (indexNow - 1) + '-' + 'clock');
						window.localStorage.removeItem('dairy' + (indexNow - 1) + '-' + 'now');
						window.localStorage.removeItem('dairy' + (indexNow - 1) + '-' + 'title');
						window.localStorage.removeItem('dairy' + (indexNow - 1) + '-' + 'where');
					}
					indexNow--;
					createNode();
					//后续的循环覆盖
					setTimeout(function() {
						$.afui.hideMask();
						$.afui.loadContent('#read', false, false, 'fade');
					}, 2000);
				}
			});
		});
		setTimeout(function() {
			$.afui.hideMask();
		}, 1000);
	}
	//创建时间轴

	function createTimeLine(num) {
		if (num >= indexNow) {
			num = indexNow;
		}
		// 倒序输出最新文章
		var str = "";
		for (var i = indexNow - 1; i >= indexNow - num; i--) {
			var mon = window.localStorage.getItem('dairy' + i + '-' + 'now');
			var clock = window.localStorage.getItem('dairy' + i + '-' + 'clock');
			var title = window.localStorage.getItem('dairy' + i + '-' + 'title');
			var content = window.localStorage.getItem('dairy' + i + '-' + 'content');
			if (content.length >= 50) {
				content = content.substring(0, 50) + '...';
			}
			str += "<li data-index=" + i + " class='animated bounceInUp'>" + "<time class='cbp_tmtime' datetime='" + mon + clock + "'>" + "<span>" + mon + "</span>" + "<span>" + clock + "</span>" + "</time>" + "<div class='cbp_tmicon cbp_tmicon-phone'></div>" + "<div class='cbp_tmlabel'>" + "<h2><a href='#read' data-transition='slide'>" + title + "</a></h2>" + "<p>" + content + "</p>" + "</div>" + "</li>";
			$(".cbp_tmtimeline").html(str);
		}
	}

	//geolocation获取经纬度
	function getPosition(){
		var lon,lat;
		var json={};
		window.navigator.geolocation.getCurrentPosition(function(pos){
			lon=pos.coords.longitude;
			lat=pos.coords.latitude;
			json.lon=lon;
			json.lat=lat;
		},function(err){
			//err.code
		 switch(err.code){
              case 0:
              alert('未知错误');
              break;
              case 1:
              alert('用户拒绝共享位置信息');
              break;
              case 2:
              alert('获取信息失败');
              break;
              case 3:
              alert('响应超时');
              break;
              default:
              alert('获取失败');
              break;
          }
          return false;
		},{
     //     configs
    	 "enableHighAcuracy":true,//使用更高的精确度
     	 "timeout":5000,//最高响应时间
     	 "maximumAge":5000//位置缓存时间
		});
	return json || false;
	}
	// 创建百度地图
	function createMap(lat,lon){
		$("#allmap").html('');
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(lat,lon);
		map.centerAndZoom(point,20);
		var marker = new BMap.Marker(point);
		map.addOverlay(marker);
		var infoWindow = new BMap.InfoWindow("我在这里");  // 创建信息窗口对象
		map.openInfoWindow(infoWindow,point); //开启信息窗口
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);//弹跳的marker
	}
});