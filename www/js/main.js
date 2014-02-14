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
			calculateRel();
		});
	}
};

$.fn.animatеScroll = function() {
	return this.each(function(){
		$(this).click(function(){
			if(!isScroll){
				isScroll = true;
				var target = $($(this).data('targetScroll')),
					currentBox = $('[data-view="true"]');

				if(target.length){
					currentBox.attr('data-view', 'false');
					target.attr('data-view', 'true').scrollTo(function(){
						isScroll = false;
					});
				} else {
					isScroll = false;
				}
			}
			return false;
		});
	});
};

$.fn.findSiblingByClass = function(className, oppositeDirection){
	var t = $(this), sibling;
		do{
			sibling = oppositeDirection ? t.prev() : t.next();

			if(sibling.hasClass(className) && sibling.is(':visible')){
				return sibling;
			} else {
				t = sibling;
			}
		}
		while(sibling.length);
	return [];
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