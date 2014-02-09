$.fn.scrollTo = function() {
	var isAnimate = false,
		offsetTop = $(this).offset().top,
		headerHeight = $('.header').outerHeight();

	if(!isAnimate){
		isAnimate = true;
		$('body, html').animate({
			scrollTop : offsetTop - headerHeight
		}, function(){
			isAnimate = false;
		});
	}
};

$.fn.animatеScroll = function() {
	return this.each(function(){
		$(this).click(function(){
			var target = $(this).data('targetScroll');
			var offsetTop = $(target).offset().top;
			var headerHeight = $('#header').outerHeight();

			$('body, html').animate({
				scrollTop : offsetTop - headerHeight
			});

			return false;
		});
	});
};

$(function(){
	$('.t-pointer').click(function(){
		var t = $(this);
		$('.sub-footer-wrap').slideToggle('fast', function(){
			if(!t.hasClass('up'))$(this).scrollTo();
			t.toggleClass('up');
		});
	});
});