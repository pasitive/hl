var isAnimate = false,
	isScroll = false;

$.fn.scrollTo = function(data) {
	if(!isAnimate){
		isAnimate = true;

	var offsetTop = $(this).offset().top,
		headerHeight = $('.header').outerHeight(),
		shift = data.opposite ? window.innerHeight - $(this).outerHeight() - headerHeight : 0;

		$('body, html').animate({
			duration: data.speed || 'slow',
			scrollTop : offsetTop - headerHeight - shift
		}, function(){
			isAnimate = false;
			data.callback && data.callback();
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
					target.attr('data-view', 'true').scrollTo({callback: function(){
						isScroll = false;
					}});
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

$.fn.staffElement = function(){
	var foundedElements = 'img.colored, .text';
	var methods = navigator.userAgent.indexOf('MSIE 8.0') == -1 ? ['fadeIn', 'fadeOut'] : ['show', 'hide'];

	return this.each(function(){
		$(this).mouseenter(function(){
			$(this).find(foundedElements)[methods[0]]();
		}).mouseleave(function(){
				$(this).find(foundedElements)[methods[1]]();
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

	$('.about-block .staff-element').staffElement();

	$('.prev-p, .next-p').css('top', (window.innerHeight - $('.header').height())/2 - 20);
});