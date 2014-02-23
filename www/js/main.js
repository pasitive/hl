var isMobile = /mobile|tablet|ipad|iphone|android/ig.test(navigator.userAgent),
	isAnimate = false,
	isScroll = false;

jQuery.fx.interval = 13;

$('link[href^="/css/"]').each(function(){
	$.get($(this).attr('href'), function(data){
		var links = data.match(/\/img\/[^)]+/g);
		if(links){
			for(var i = 0; i < links.length; i++){
				new Image().src = links[i];
			}
		}
	});
});

$.fn.metafizzyFilter = function(filterSelector) {
	return this.each(function(){

		var $container = $(this);

		$container.isotope({
			itemSelector : '.element'
		});

		var $optionSets = $(filterSelector),
			$optionLinks = $optionSets.find('li:not(.no-selectable)');

		$optionLinks.click(function(){
			var $this = $(this);

			// don't proceed if already selected
			if ( $this.hasClass('active') ) {
				return false;
			}
			var $optionSet = $this.parent();
			$optionSet.find('.active').removeClass('active');
			$this.addClass('active');

			// make option object dynamically, i.e. { filter: '.my-filter-class' }
			var options = {},
				key = $optionSet.attr('data-option-key'),
				value = $this.attr('data-option-value');
			// parse 'false' as false boolean
			value = value === 'false' ? false : value;
			options[ key ] = value;
			if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
				// changes in layout modes need extra logic
				changeLayoutMode( $this, options )
			} else {
				// otherwise, apply new options
				$container.isotope( options );
			}
		});
	});
};


$.fn.scrollTo = function(data) {
	if(!isAnimate){
		isAnimate = true;

	var offsetTop = $(this).offset().top,
		headerHeight = $('.header').outerHeight(),
		shift = data.opposite ? window.innerHeight - $(this).outerHeight() - headerHeight : 0;

		$('body, html').animate({
			scrollTop : offsetTop - headerHeight - shift
		}, data.speed || 1500 ,function(){
			isAnimate = false;
			data.callback && data.callback();
			calculateRel();
		});
	}
};

$.fn.animatеScroll = function(callback) {
	return this.each(function(){
		$(this).click(function(){
			if(!isScroll){
				isScroll = true;
				var target = $($(this).data('targetScroll')),
					currentBox = $('[data-view="true"]');

				if(target.length){
					currentBox.attr('data-view', 'false');
					target.attr('data-view', 'true').scrollTo({callback: function(){
						callback && callback();
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

if(isMobile)$('html').addClass('mobile-os');

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
			if(!t.hasClass('up')){
				$(this).scrollTo({opposite: true});
			}
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