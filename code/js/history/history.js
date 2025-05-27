
	
 /* ************************
  * 브라우저의 스크롤바의 수직 위치 측정 함수
  * return 스크롤바 위치 값
  ************************ */
function getScrollTop () {
	return $(window).scrollTop();
}



/* ************************
  * 갯수체크 함수
  * @param selector : 선택자
  * 1개이상 있으면 return true
  ************************ */
$.exists = function(selector) {
	return ($(selector).length > 0);
}



/* ************************
  * 상단에 fixed를 되고있는 object의 높이값 체크 함수
  * return : top-fixed 되고있는 높이의 total값
  ************************ */
function checkFixedHeight () {
	var fixedTotalHeight = null;
	for (var i=0; i<$(".top-fixed").length; i++) {
		var fixedTotalHeight = fixedTotalHeight + $(".top-fixed").eq(i).outerHeight();
	}
	return fixedTotalHeight;
}

/* ************************
  * event 최적화(requestAnimationFrame)
  ************************ */
function toFit(cb, _ref) {
	var _ref$dismissCondition = _ref.dismissCondition,
		dismissCondition = _ref$dismissCondition === void 0 ? function () {
		return false;
	} : _ref$dismissCondition,
	  _ref$triggerCondition = _ref.triggerCondition,
	  triggerCondition = _ref$triggerCondition === void 0 ? function () {
	return true;
	} : _ref$triggerCondition;

		if (!cb) {
			throw Error('Invalid required arguments');
		}

		var tick = false;
		return function () {
		//  console.log('scroll call')
		if (tick) {
			return;
		}

		tick = true;
		return requestAnimationFrame(function () {
			if (dismissCondition()) {
				tick = false;
				return;
			}

			if (triggerCondition()) {
				//console.log('real call')
				tick = false;
				return cb();
			}
		});
	};
}

 





/* ************************
	* Func : 컨텐츠 메뉴 FIXED 및 클릭시 해당영역 이동
	* getScrollTop(), getWindowWidth(), checkOffset(), toFit(), checkFixedHeight(), moveScrollTop() 필요
	************************ */
	if ($.exists(".cm-fixed-tab-container-JS")) {
		var $fixedMoveTab = $(".cm-fixed-tab-list-JS");		// fixed되는 메뉴 클래스
		var $moveTabItem = $fixedMoveTab.find("li");
		var $moveConItem = $('.sub-tab-content-style').find(".sub-tab-con");
		var menuCount= $moveTabItem.length;
		var nav = [];
		
		$(window).on('load', function  () {
			checkStartOffset();
			nav = checkTopOffset();
		});
		$(window).on('resize', function  () {
			checkStartOffset();
			nav = checkTopOffset();
		}); 		
		
		// 탭이 붙기 시작하는 지점 체크
		function checkStartOffset () {
			var fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - checkFixedHeight();				
			//var fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - $("#header").height();	
			if($.exists('.history-page')){
				fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - $("#header").height();
			}else if($.exists('.loca-page')){
				if(getWindowWidth() > tabletWidth){
					fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - 100;
				}else{
					fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - $("#header").height();
				}
				
			}else if($.exists('.research-page')){
				fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - 50;
			}
			return fixedStartPoint;
		}		

		// 해당되는 각각의 영역 상단값 측정
		function checkTopOffset () {
			var arr = [];
			for(var i=0;i < menuCount;i++){
				arr[i]=$($moveTabItem.eq(i).children("a").attr("href")).offset().top;
			}
			return arr;
		}
		
		// 스크롤 0일때 상단fixed되는 높이값 체크
		function checkFixedObjectHeight () {
			var fixedObjectTotalHeight = 0;
			for (var i=0; i<$(".top-fixed-object").length; i++) {
				var fixedObjectTotalHeight = fixedObjectTotalHeight + $(".top-fixed-object").eq(i).outerHeight();
			}
			return fixedObjectTotalHeight;
		}

		// 스크롤 event 
		window.addEventListener('scroll', toFit(function  () {
			// 메뉴fixed
			// objectFixed($fixedMoveTab, checkStartOffset(), "top-fixed");

			if ($('#header').hasClass('scroll-down')) {
				if ( getScrollTop() >  checkStartOffset() ) {
					$fixedMoveTab.addClass("top-fixed");
				}else if ( getScrollTop() <  (checkStartOffset() + $fixedMoveTab.height()) ) {
					$fixedMoveTab.removeClass("top-fixed");				
				}
			}else {
				if ( getScrollTop() >  checkStartOffset() - $('#header').height() ) {
					$fixedMoveTab.addClass("top-fixed");
				}else if ( getScrollTop() <  (checkStartOffset() + $fixedMoveTab.height()) - $('#header').height() ) {
					$fixedMoveTab.removeClass("top-fixed");				
				}
			}

			$moveTabItem.each(function  (idx) {
				var eachOffset = nav[idx] -  checkFixedHeight();
				var minusOffset = $(window).height() / 6;	// 스크롤시 selected 붙는 지점을 조금 더 빠르게 하기위해 추가
				
				if( (getScrollTop() + minusOffset) >= eachOffset ){
					$moveTabItem.removeClass('selected');
					$moveTabItem.eq(idx).addClass('selected');
					// 모바일 드롭메뉴일때
					if ($.exists($moveTabItem.parents(".cm-drop-menu-box-JS"))) {
						$fixedMoveTab.find(".cm-drop-open-btn-JS > span").text($moveTabItem.eq(idx).find("em").text());
					}
				};
			});
			}, {
		}),{ passive: true })
	
	}

	




/* ************************
* Func : 컨텐츠 메뉴 FIXED 및 클릭시 해당영역 이동
* getScrollTop(), getWindowWidth(), checkOffset(), toFit(), checkFixedHeight(), moveScrollTop() 필요
************************ */
if ($.exists(".history-con-box")) {
	var $fixedMoveHistoryTab = $(".history-type-box");		// fixed되는 메뉴 클래스
	var $moveHistoryItem = $fixedMoveHistoryTab.find("li");
	var historyCount= $moveHistoryItem.length;
	var historyNav = [];
	var $yearItem = $('.history-count-JS');
	var yearCount= $yearItem.length;
	var yearNav = [];

	$(window).on('load', function  () {
		checkStartOffsetHistory();
		historyNav = checkTopOffsetHistory();
		yearNav = checkTopOffsetYear();
	});
	$(window).on('resize', function  () {
		checkStartOffsetHistory();
		historyNav = checkTopOffsetHistory();
		yearNav = checkTopOffsetYear();
	});

	// 탭이 붙기 시작하는 지점 체크
	function checkStartOffsetHistory () {
		var fixedStartPoint =  $(".history-con-box").offset().top;
		return fixedStartPoint;
	}

	// 해당되는 각각의 영역 상단값 측정
	function checkTopOffsetHistory () {
		var arr = [];
		for(var i=0;i < historyCount;i++){
			arr[i]=$($moveHistoryItem.eq(i).children("a").attr("href")).offset().top;
		}
		return arr;
	}
	// 해당되는 각각의 영역 상단값 측정
	function checkTopOffsetYear () {
		var arr2 = [];
		for(var i=0;i < yearCount;i++){
			arr2[i]=$yearItem.eq(i).offset().top;
		}
		return arr2;
	}

	// 스크롤 0일때 상단fixed되는 높이값 체크
	function checkFixedObjectHeightHistory () {
		var fixedObjectTotalHeightHistory = 0;
		for (var i=0; i<$(".top-fixed-object").length; i++) {
			var fixedObjectTotalHeightHistory = fixedObjectTotalHeightHistory + $(".top-fixed-object").eq(i).outerHeight();
		}
		return fixedObjectTotalHeightHistory;
	}

	// 스크롤 event
	window.addEventListener('scroll', toFit(function  () {
		// 메뉴fixed
		// objectFixed($fixedMoveHistoryTab, checkStartOffsetHistory(), "top-fixed");

		if ( getScrollTop() >  checkStartOffsetHistory()) {
			$fixedMoveHistoryTab.addClass("top-fixed");
		}else if ( getScrollTop() <  (checkStartOffsetHistory() + $fixedMoveHistoryTab.height() - $('#header').height()) ) {
			$fixedMoveHistoryTab.removeClass("top-fixed");
		}
		if (getScrollTop() > $('.history-con-box').height() + $('#header').height() + 50){
			$('.certifi-tab-list-style').addClass('bottom-fixed');
		}else {
			$('.certifi-tab-list-style').removeClass('bottom-fixed');
		}

		$moveHistoryItem.each(function  (idx) {
			var eachOffset = historyNav[idx];
			var minusOffset = $(window).height() / 2;

			if( (getScrollTop() + minusOffset) >= eachOffset ){
				$moveHistoryItem.removeClass('selected');
				$moveHistoryItem.eq(idx).addClass('selected');

				$('.history-tit-box').removeClass(function(index, className) {
					return (className.match(/\bselected(?!(idx+1))\S+/g) || []).join(' ');
				});
				$('.history-tit-box').addClass('selected' + (idx+1));
				// 모바일 드롭메뉴일때
				if ($.exists($moveHistoryItem.parents(".cm-drop-menu-box-JS"))) {
					$fixedMoveHistoryTab.find(".cm-drop-open-btn-JS > span").text($moveHistoryItem.eq(idx).find("em").text());
				}
			};
		});

		
		$('.year').each(function(idx) {
			var top = $(this).offset().top;
			var bottom = top + $(this).outerHeight();
			var scrollPos = $(window).scrollTop();
			var windowHeight = $(window).height();

			var eachOffset = yearNav[idx];
			if ($('#header').hasClass('scroll-down')) {
				var minusOffset = $(window).height() / 5;
			}else {
				var minusOffset = $(window).height() / 4;
			}


			if ((getScrollTop() + minusOffset) >= eachOffset) {
				yearCountNum($(this).text());
				$(this).parents('.info-item').addClass('on');
			}
		});


		}, {
	}),{ passive: true })

	// 클릭 event
	$moveHistoryItem.find("a").click(function  () {
		var goDiv2Offset = $($(this).attr("href")).offset().top;	// 이동해야할 지점
		if ( getScrollTop()  < checkStartOffsetHistory()) {
			if ($('#header').hasClass('scroll-down')) {
				var goDiv2 = goDiv2Offset - $fixedMoveHistoryTab.height() - 20;
			}else {
				var goDiv2 = goDiv2Offset - $('#header').height() - $fixedMoveHistoryTab.height() - 20;
			}
		}else {
			if ($('#header').hasClass('scroll-down')) {
				var goDiv2 = goDiv2Offset - $fixedMoveHistoryTab.height() - 20;
			}else {
				var goDiv2 = goDiv2Offset - $('#header').height() - $fixedMoveHistoryTab.height() - 20;
			}
		}
		setTimeout(function  () {
			moveScrollTop(goDiv2);
		});
		return false;
	});
let lastClasses = {
  count01: '',
  count02: '',
  count03: '',
  count04: ''
};
	function yearCountNum (scrollYear) {
		var year = scrollYear;
		var firstChar = year.charAt(0);
		var secondChar = year.charAt(1);
		var thirdChar = year.charAt(2);
		var fourthChar = year.charAt(3);

		$('.info-item').removeClass('on');

		$('.count-num-item-box').removeClass(function(index, className) {
			// 'count'로 시작하는 클래스만 제거
			return (className.match(/\bcounting\S*/g) || []).join(' ');
		});
		
		console.log(lastClasses.count04, fourthChar)
		if (lastClasses.count04 !== fourthChar) {
			$('#count04').find('.count-num-item-box').addClass('counting' + fourthChar);
			lastClasses.count04 = fourthChar;  // 마지막 값 저장
		}
		//$('#count04').find('.count-num-item-box').addClass('counting' + fourthChar);
		$('#count03').find('.count-num-item-box').addClass('counting' + thirdChar);
		$('#count02').find('.count-num-item-box').addClass('counting' + secondChar);
		$('#count01').find('.count-num-item-box').addClass('counting' + firstChar);
	}
}



