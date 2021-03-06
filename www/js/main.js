var isMobile = /mobile|tablet|ipad|iphone|android/ig.test(navigator.userAgent),
	isAnimate = false,
	isScroll = false;

/*Redefine animation frequency*/
jQuery.fx.interval = 13;

/*Preload images*/
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

/*Isotop filter*/
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

/*Scroll to element method*/
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
			typeof calculateRel == 'function' && calculateRel();
		});
	}
};

/*Scroll to section by anchor*/
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

/*Find closest sibling method*/
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

/*Staff element handler*/
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

/*Custom radio button*/
$.fn.customRadio = function(){
	$(this).click(function(){
		$('[name="' + $(this).attr('name') + '"]').parent('label').removeClass('checked');
		$(this).parent('label').addClass('checked');
	});
};

/*Define mobile style*/
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

	/*custom radio buttons*/
	$('[type="radio"]').customRadio();

	/*Sub-footer toddler*/
	$('.t-pointer').click(function(){
		var t = $(this);
		$('.sub-footer-wrap').slideToggle('fast', function(){
			if(!t.hasClass('up')){
				$(this).scrollTo({opposite: true});
			}
			t.toggleClass('up');
		});
	});

	/*Prevent sub-menu jumping by hover*/
	$('.sub-menu li').each(function(){
		$(this).css({'width': $(this).outerWidth(), 'padding': 0});
	});

	/*Overlay handlers*/
	$('.callback-btn').click(function(){
		$('.overlay, .popup-wrap').fadeIn('slow');
	});

	$('.popup').click(function(e){
		e.stopPropagation();
	});

	$('.overlay, .popup-wrap').click(function(){
		$('.overlay, .popup-wrap, .player-wrap').fadeOut('slow');
	});

	$('.about-block .staff-element').staffElement();

	$('.prev-p, .next-p').css('top', (window.innerHeight - $('.header').height())/2 - 20);

	/*Fixed footer*/
	$('.container').css('min-height', window.innerHeight - 134);

});