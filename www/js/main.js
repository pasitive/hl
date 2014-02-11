var isAnimate = false,
	isScroll = false;

$.fn.scrollTo = function(callback) {
	if(!isAnimate){
		isAnimate = true;

	var offsetTop = $(this).offset().top,
		headerHeight = $('.header').outerHeight();

		$('body, html').animate({
			scrollTop : offsetTop - headerHeight
		}, function(){
			isAnimate = false;
			callback && callback();
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