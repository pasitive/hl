var isAnimate = false,
	isScroll = false;

$.fn.scrollTo = function(callback, opposite) {
	if(!isAnimate){
		isAnimate = true;

	var offsetTop = $(this).offset().top,
		headerHeight = $('.header').outerHeight(),
		shift = opposite ? window.innerHeight - $(this).outerHeight() - headerHeight : 0;

		$('body, html').animate({
			scrollTop : offsetTop - headerHeight - shift
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
	/*Custom placeholder*/
	$('input[type="text"], textarea').placeholder();

	/*Customs textarea scroll*/
	$('textarea').cs();

	/*Custom select*/
	$('select').selectbox({
		onOpen : function(inst) {
			$(inst.input).next().addClass('opened');
		},
		onClose: function (inst) {
			$(inst.input).next().removeClass('opened');
		}
	});

	$('.t-pointer').click(function(){
		var t = $(this);
		$('.sub-footer-wrap').slideToggle('fast', function(){
			if(!t.hasClass('up'))$(this).scrollTo();
			t.toggleClass('up');
		});
	});

	$('.sub-menu li').each(function(){
		$(this).css({'width': $(this).outerWidth(), 'padding': 0});
	});

	$('.callback-btn').click(function(){
		$('.overlay, .popup-wrap').fadeIn('slow');
	});

	$('.popup').click(function(e){
		e.stopPropagation();
	});

	$('.overlay, .popup-wrap').click(function(){
		$('.overlay, .popup-wrap').fadeOut('slow');
	});
});