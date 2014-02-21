var position = {},
	availHeight,
	headerHeight = 118,
	countAvailHeight = function(){
		var maxHeight = 620,
			avail = window.innerHeight - headerHeight;
			availHeight = avail <= maxHeight ? maxHeight : avail;
		return availHeight;
	},
	calculateRel = function(){
		position = {};
		$('[data-view]:visible').each(function(){
			position[$(this).data('section')] = $(this).offset().top;
		});
	},
	sectionSlide = function(data){
		if(!isScroll){
			isScroll = true;
			var currentBox = $('[data-view="true"]'),
				newBox;

			newBox = data.node && data.node.length ? data.node : currentBox.findSiblingByClass('scroll-section', data.direction);

			if(newBox.length){
				currentBox.attr('data-view', 'false');
				newBox.attr('data-view', 'true').scrollTo({
					speed: data.speed,
					callback: function(){
						isScroll = false;
					}
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
			sectionSlide({direction: direction});
		});
	},
	detachHomeHandlers = function(){
		$(window).unbind('scroll resize');
		$(document).unbind('mousewheel');
	},
	viewModule = {
		'state': 'main',
		'defineState': function(){
			viewModule['state'] = location.hash && location.hash.replace(/#/, '');
		},
		'checkData': function(array){
			var arr = [];
			for(var i = 0; i < array.length; i++){
				arr.push('#' + array[i]);
			}
			return arr.join(',');
		},
		'setState': function(state){
			location.hash = state;
			viewModule['state'] = state;
		},
		'stateHandler': {
			'main': function(data){
				var section = data[0] || '',
					toHide = viewModule['state'].split('/');

				for(var i = 0; i < toHide.length; i++){
				 	$('#' + toHide[i]).hide();
				}
				$('#main').fadeIn(1000, function(){
					attachHomeHandlers();
				});
				if(section){
					sectionSlide({speed: 100, node: $('#' + section)});
					//document.body.scrollTop = 0;
				}
				viewModule['setState']('main');
			},
			'projects': function(data){
				var project = data[0],
					section = data[1],
					toHide = viewModule['state'].split('/');

				if(project && section){
					for(var i = 0; i < toHide.length; i++){
						$('#' + toHide[i]).hide();
					}
					detachHomeHandlers();
					$('#' + project + ', #' + section).show();
					document.body.scrollTop = 0;
					$('#projects').fadeIn(1000);
					//$('html, body').scrollTo({speed:100});
					viewModule['setState']('projects/' + project + '/' + section);
				} else {
					viewModule['changeState']('main');
				}
			}
		},
		'changeState': function(value){
			var arr = value.split('/'),
				arrLenght = arr.length;

			if(arrLenght && arrLenght == $(viewModule['checkData'](arr)).length){
				viewModule['stateHandler'][arr[0]](arr.slice(1));
			} else {
				viewModule['changeState']('main');
			}
		}
	};

document.write('<style type="text/css">.full-height{min-height: ' + countAvailHeight() + 'px;}.inner-full-height{height: ' + countAvailHeight() + 'px;}</style>');

$(function(){
	var hash = location.hash && location.hash.replace(/#/, '');
	if(hash && hash != 'main'){
		viewModule['changeState'](hash);
	} else {
		document.body.scrollTop = 0;
		$('html, body').scrollTo({speed:100});
		$('#main').fadeIn('slow');
	}

	if(viewModule['state'] != 'main'){
		detachHomeHandlers();
	} else {
		attachHomeHandlers();
		setTimeout(function(){
			calculateRel();
		}, 500);
	}

	$('.portfolio .element, .close_but_anchor').click(function(e){
		e.preventDefault();
		var href = $(this).attr('href').replace(/#/, '');
		viewModule['changeState'](href);
	});

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
			sectionSlide({direction: false});
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

			sectionSlide({direction: false});

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