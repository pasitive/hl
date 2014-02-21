var availHeight,
	headerHeight = 118,
	countAvailHeight = function(){
		var maxHeight = 620,
			avail = window.innerHeight - headerHeight;

		availHeight = avail <= maxHeight ? maxHeight : avail;

		return availHeight;
	},
	position = {},
	calculateRel = function(){
		position = {};
		$('[data-view]:visible').each(function(){
			position[$(this).data('section')] = $(this).offset().top;
		});
	},
	sectionSlide = function(direction){
		if(!isScroll){
			isScroll = true;
			var currentBox = $('[data-view="true"]'),
				newBox;

			newBox = currentBox.findSiblingByClass('scroll-section', direction);

			if(newBox.length){
				currentBox.attr('data-view', 'false');
				newBox.attr('data-view', 'true').scrollTo(function(){
					isScroll = false;
				});
			} else {
				isScroll = false;
			}
		}
	},
	defineFooterPos = function(){
		var footer = $('.footer'),
			lastSection = $('.content-ask-form-wrap'),
			lastSectionContent = lastSection.find('.content-ask-form'),
			marginBottom = lastSection.height() - lastSectionContent.height();

		lastSection.css({
			'height': lastSectionContent.height(),
			'min-height': lastSectionContent.height(),
			'margin-bottom': marginBottom
		});

		footer.css('margin-top', (-1)*marginBottom);
	},
	attachHomeHandlers = function(){
		/*Handle scrolling by toddler*/
		$(window).bind('scroll', function(){
			if(!isAnimate){
				var header = $('.header'),
					hHeight = header.height(),
					hOffset = header.offset().top,
					shift = hOffset + hHeight,
					sectionInView;

				for(var p in position){
					if(shift > position[p] && shift < position[p] + availHeight){
						sectionInView = $('[data-section="' + p + '"]');
						if(sectionInView.length){
							$('[data-view="true"]').attr('data-view', 'false');
							sectionInView.attr('data-view', 'true');
							return;
						}
					}
				}
			}
		});

		/*Height by window resize*/
		$(window).bind('resize', function(){
			$('.full-height').css('min-height', countAvailHeight());
			$('.inner-full-height').css('height', countAvailHeight());
			defineFooterPos();
		});

		/*Section sliding*/
		$(document).bind('mousewheel', function(e, delta){
			e.preventDefault();
			var direction = delta > 0;
			sectionSlide(direction);
		});
	},
	detachHomeHandlers = function(){
		$(window).unbind('scroll resize');
		$(document).unbind('mousewheel');
	},
	viewModule = {
		'state': '',
		'defineState': function(){
			viewModule['state'] = location.hash ? location.hash.replace(/#/, '') : 'main';
		},
		'setState': function(state){
			location.hash = state;
			viewModule['state'] = state;
		},
		'stateHandler': {
			'main': function(section){
				var toHide = viewModule['state'].split('/');
				for(var i = 0; i < toHide.length; i++){
				 	$('#' + toHide[i]).hide();
				}
				$('#main').fadeIn('slow', function(){
					attachHomeHandlers();
				});
				if(section){
					console.log(1);
					$('body, html').scrollTop( $('#' + section).offset().top - headerHeight );
				}
				viewModule['setState']('main');
			},
			'projects': function(project, section){
				var toHide = viewModule['state'].split('/');
				for(var i = 0; i < toHide.length; i++){
					$('#' + toHide[i]).hide();
				}
				detachHomeHandlers();
				$('#' + project + ', #' + section).fadeIn('slow');
				viewModule['setState'](project + '/' + section);
			}
		},
		'changeState': function(value){
			var arr = value.split('/');
			console.log(arr);
			if(arr.length == 2){
				viewModule['stateHandler'][arr[0]](arr[1]);
			}
			else if(arr.length == 3){
				viewModule['stateHandler'][arr[0]](arr[1], arr[2]);
			}
			else {
				viewModule['stateHandler'][value]();
			}
		}
	};

document.write('<style type="text/css">.full-height{min-height: ' + countAvailHeight() + 'px;}.inner-full-height{height: ' + countAvailHeight() + 'px;}</style>');

$(function(){
	viewModule['defineState']();

	console.log(viewModule['state']);

	viewModule['changeState'](viewModule['state']);

	if(viewModule['state'] != 'main'){
		detachHomeHandlers();
	} else {
		attachHomeHandlers();
		setTimeout(function(){
			calculateRel();
		}, 500);
	}

	$('html, body').scrollTo();

	$('.custom-scrollbar').mCustomScrollbar();

	/*Bubbles*/
	setTimeout(function() {
		$('.bubble-bounce').bubbleBounce();
		$('.bubble-fade').bubbleFade();
	}, 500);

	$('.bubble-bounce .circle').bubbleBalance();
	$('.bubble-bounce .circle').animatеScroll();

	/*Service list*/
	$('.expand-toddler').click(function(){

		if (!$(this).hasClass('opened'))
		{
			$('.content-services-wrap').slideDown('slow');
			sectionSlide(false);
			$(this).addClass('opened');
			$(this).text('Свернуть');
		}
		else
		{
			$('.content-services-wrap').slideUp('fast');
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


	/*Portfolio button*/
	$('.portfolio-btn').click(function(){

		// Replace text
		var textElement = $(this);

		var target = $($(this).data('target'));

		if ( ! $(this).data('opened') )
		{
			$(this).data('opened', true);

			textElement.text($(this).data('hideText'));

			// Show portfolio
			target.slideDown('slow');

			sectionSlide(false);

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
			target.slideUp('fast');
		}
	});

	/*Portfolio elements*/
	$('.portfolio-element').mouseenter(function(){
		$(this).find('img').fadeOut(100);
	}).mouseleave(function(){
		$(this).find('img').fadeIn(100);
	});

	/*Define footer shift fix*/
	/*setTimeout(function(){
		$(window).trigger('resize');
	}, 500);*/
});