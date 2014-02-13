var countAvailHeight = function(){
	return window.innerHeight - 117;
};

document.write('<style type="text/css">.full-height{min-height: ' + countAvailHeight() + 'px;}.inner-full-height{height: ' + countAvailHeight() + 'px;}</style>');

$(function(){
	var findSibling = function(oppositeDirection){

	};

	$('html, body').animate({scrollTop: 0});

	/*Section sliding*/
	$(document).bind('mousewheel', function(e, delta){
		e.preventDefault();
		if(!isScroll){
			isScroll = true;
			var currentBox = $('[data-view="true"]'),
				newBox;

			if(delta < 0){
				newBox = currentBox.next().next('.scroll-section');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						isScroll = false;
					});
				} else {
					isScroll = false;
				}
			} else {
				newBox = currentBox.prev().prev('.scroll-section');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						isScroll = false;
					});
				} else {
					currentBox.scrollTo(function(){
						isScroll = false;
					});
				}

			}
		}
	});

	/*Height by window resize*/
	$(window).bind('resize', function(){
		$('.full-height').css('min-height', countAvailHeight());
		$('.inner-full-height').css('height', countAvailHeight());
	});

	/*Bubbles*/
	setTimeout(function() {
		$('.bubble-bounce').bubbleBounce();
		$('.bubble-fade').bubbleFade();
	}, 500);

	$('.bubble-bounce .circle').bubbleBalance();

	/*Service list*/
	$('.expand-toddler').click(function(){

		if (!$(this).hasClass('opened'))
		{
			$('.services').slideDown(function(){
				$(this).scrollTo(function(){}, true);
			});
			$(this).addClass('opened');
			$(this).text('Свернуть');
		}
		else
		{
			$('.services').slideUp(function(){
				$('[data-view="true"]').scrollTo();
			});
			$(this).removeClass('opened');
			$(this).text('Развернуть');
		}
	});

	$('.our-services-list-index li').click(function() {

		if ($(this).hasClass('active')) return false;

		var index = $(this).index();
		var descElements = $('.our-services-list-description li');
		var speed = 'fast';

		$(this).addClass('active').siblings('.active').removeClass('active');

		descElements.filter('.active').fadeOut(speed, function(){
			$(this).removeClass('active');
			descElements.eq(index).fadeIn(speed, function(){
				$(this).addClass('active');
			});
		});

	});

	/**
	 * Portfolio button
	 */
	$('.portfolio-btn').click(function(){

		// Replace text
		var textElement = $(this);

		var target = $($(this).data('target'));

		if ( ! $(this).data('opened') )
		{
			$(this).data('opened', true);

			textElement.text($(this).data('hideText'));

			// Show portfolio
			target.slideDown('slow', function(){
				// Scroll to portfolio
				target.scrollTo(function(){}, true);
			});

			// Define slider
			var slides = target.find('.slides');
			var slider = slides.parent();

			// Start slider
			if (!slides.data('started') && slides.find('.slide').size() > 1)
			{
				// Show navigation if necessary
				slider.find('.navigation').show();
				slides.cycle({
					fx              : 'scrollHorz',
					prev            : slider.find('.navigation .prev'),
					next            : slider.find('.navigation .next'),
					pager           : slider.find('.slider-pager'),
					cleartype       : false,
					timeout         : 100000,
					containerResize : false,
					slideResize     : false,
					fit             : 1
				});
				slides.data('started', true);
			}
		}
		else
		{
			// Hide portfolio
			$(this).data('opened', false);
			textElement.text($(this).data('showText'));
			target.slideUp('slow', function(){
				$('[data-view="true"]').scrollTo();
			});
		}
	});



	/**
	 * Portfolio elements
	 */
	$('.portfolio-element').mouseenter(function(){
		$(this).find('img').fadeOut(100);
	}).mouseleave(function(){
		$(this).find('img').fadeIn(100);
	});
});