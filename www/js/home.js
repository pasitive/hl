var position = {},
	availHeight,
	headerHeight = 118,
	countAvailHeight = function(){
		var maxHeight = 620,
			avail = window.innerHeight - headerHeight;
			availHeight = avail <= maxHeight ? maxHeight : avail;
		return availHeight;
	},
	calculateSlideWidth = function(){
		$('.project-item').width(window.innerWidth);
		$('.slide-wrap').each(function(){
			var slidesNum = $(this).find('.project-item').length,
				current = $(this).find('.project-item.current'),
				currentId = current.attr('id');
			$(this).width(window.innerWidth*slidesNum);
			if(current && currentId){
				$(this).css('left', (-1)*( currentId.replace(/\D/g, '') - 1)*window.innerWidth );
				if(!current.prev().length){
					$(this).parent().find('.prev-p').hide();
				}
				if(!current.next().length){
					$(this).parent().find('.next-p').hide();
				}
			}
		});

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
				newBox.attr('data-view', 'true');
				if(data.noAnimate){
					setTimeout(function(){
						document.body.scrollTop = position[newBox.data('section')] - headerHeight;
						isScroll = false;
					}, 0);
				} else {
					newBox.scrollTo({
						speed: data.speed,
						callback: function(){
							isScroll = false;
						}
					});
				}
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
	attachProjectHandlers = function(){
		$(window).bind('resize', function(){
			calculateSlideWidth();
		});
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
					toHide = viewModule['state'].split('/'),
					l = toHide.length > 1 ? toHide.length - 1: toHide.length;

				for(var i = 0; i < l; i++){
					$('#' + toHide[i]).hide();
					}

				$('#main').fadeIn(1000);

				if(section){
					sectionSlide({noAnimate: true, node: $('#' + section)});
				}

				attachHomeHandlers();
				viewModule['setState']('main');
			},
			'projects': function(data){
				var current,
					project = data[0],
					section = data[1],
					toHide = viewModule['state'].split('/'),
					l = toHide.length > 1 ? toHide.length - 1: toHide.length;

				if(project && section){
					for(var i = 0; i < l; i++){
						$('#' + toHide[i]).hide();
					}

					detachHomeHandlers();
					attachProjectHandlers();

					$('#' + project).show();
					$('#projects').fadeIn(1000);

					setTimeout(function(){
						document.body.scrollTop = 0;

						$('#' + project + ' .slide-wrap').css( 'left', (-1)*( section.replace(/\D/g, '') - 1)*window.innerWidth );
						current = $('#' + section).addClass('current');

						if(!current.prev().length){
							$('#' + project + ' .prev-p').hide();
						} else {
							$('#' + project + ' .prev-p').show();
						}
						if(!current.next().length){
							$('#' + project + ' .next-p').hide();
						} else {
							$('#' + project + ' .next-p').show();
						}
					}, 0);

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
		//$('html, body').scrollTo({speed:100});
		setTimeout(function(){
			document.body.scrollTop = 0;
		}, 100);
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

	calculateSlideWidth();
	attachProjectHandlers();

	$('.portfolio .element').click(function(e){
		e.preventDefault();
		var href = $(this).attr('href').replace(/#/, '');
		viewModule['changeState'](href);
	});

	$('.close_but_anchor').click(function(e){
		e.preventDefault();
		var href = $(this).attr('href').replace(/#/, '');
		$(this).closest('.nav-wrap').parent().find('.current').removeClass('current');
		viewModule['changeState'](href);
	});

	$('.prev-p').click(function(e){
		e.preventDefault();
		if(!isScroll){
			isScroll = true;

			var slider = $(this).closest('.nav-wrap').next('.slide-wrap'),
				projectId = slider.parent().attr('id'),
				current = slider.find('.current'),
				prev = current.prev(),
				prevId = prev.attr('id');

			if(prev.length){
				document.body.scrollTop = 0;
				slider.animate({'left': (-1)*( prevId.replace(/\D/g, '') - 1)*window.innerWidth}, 1500, function(){
					current.removeClass('current');
					prev.addClass('current');

					viewModule['setState']('projects/' + projectId + '/' + prevId);
					isScroll = false;
				});
				if(!prev.prev().length){
					$('#' + projectId + ' .prev-p').fadeOut('slow');
				}
				$('#' + projectId + ' .next-p').fadeIn('slow');
			}
		}
	});

	$('.next-p').click(function(e){
		e.preventDefault();
		if(!isScroll){
			isScroll = true;

			var slider = $(this).closest('.nav-wrap').next('.slide-wrap'),
				projectId = slider.parent().attr('id'),
				current = slider.find('.current'),
				next = current.next(),
				nextId = next.attr('id');

			if(next.length){
				document.body.scrollTop = 0;
				slider.animate({'left': (-1)*( nextId.replace(/\D/g, '') - 1)*window.innerWidth}, 1500, function(){
					current.removeClass('current');
					next.addClass('current');

					viewModule['setState']('projects/' + projectId + '/' + nextId);
					isScroll = false;
				});
				if(!next.next().length){
					$('#' + projectId + ' .next-p').fadeOut('slow');
				}
				$('#' + projectId + ' .prev-p').fadeIn('slow');
			}
		}
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