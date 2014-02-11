var countAvailHeight = function(){
	return window.innerHeight - 117;
};

document.write('<style type="text/css">.full-height{min-height: ' + countAvailHeight() + 'px;}</style>');

$(function(){
	$(document).bind('mousewheel', function(e, delta){
		e.preventDefault();
		if(!isScroll){
			isScroll = true;
			var currentBox = $('[data-view="true"]'),
				newBox;

			if(delta < 0){
				newBox = currentBox.next('.full-height');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						isScroll = false;
					});
				} else {
					isScroll = false;
				}
			} else {
				newBox = currentBox.prev('.full-height');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						isScroll = false;
					});
				} else {
					isScroll = false;
				}

			}
		}
	});

	/*var lastScrollTop = 0;

	$(window).scroll(function(e){
		if(!isScroll){
			e.preventDefault();
			isScroll = true;
			var st = $('html, body').scrollTop(),
				currentBox = $('[data-view="true"]'),
				newBox;
			if (st > lastScrollTop){
				newBox = currentBox.next('.full-height');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						setTimeout(function(){
							isScroll = false;
						}, 50);
					});
				} else {
					isScroll = false;
				}
			} else {
				newBox = currentBox.prev('.full-height');
				if(newBox.length){
					currentBox.attr('data-view', 'false');
					newBox.attr('data-view', 'true').scrollTo(function(){
						setTimeout(function(){
							isScroll = false;
						}, 50);
					});
				} else {
					isScroll = false;
				}
			}
			lastScrollTop = st;
		}
	});*/

	$(window).bind('resize', function(){
		$('.full-height').css('min-height', countAvailHeight());
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
				$(this).scrollTo();
			});
			$(this).addClass('opened');
			$(this).text('Свернуть');
		}
		else
		{
			$('.services').slideUp();
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
});