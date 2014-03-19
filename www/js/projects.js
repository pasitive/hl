var hash = location.hash && location.hash.replace(/#/, ''),
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
	attachProjectHandlers = function(){
		$(window).bind('resize', function(){
			calculateSlideWidth();
		});
	},
	detachProjectHandlers = function(){
		$(window).unbind('resize');
	},
/*define what need to be shown by the hash*/
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

				if(isMobile){
					$('#main').show();
				} else {
					$('#main').fadeIn(1000);
				}

				setTimeout(function(){
					$('html, body').scrollTo({speed:1});
				}, 0);

				detachProjectHandlers();

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

					attachProjectHandlers();

					$('#' + project).show();
					if(isMobile){
						$('#projects').show();
					} else {
						$('#projects').fadeIn(1000);
					}
					calculateSlideWidth();

					setTimeout(function(){
						$('html, body').scrollTop(0);

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

			console.log(value);

			if(arrLenght && arrLenght == $(viewModule['checkData'](arr)).length){
				viewModule['stateHandler'][arr[0]](arr.slice(1));
			} else {
				viewModule['changeState']('main');
			}
		}
	};

$(function(){
	$('.hide-btn').click(function(){
		var t = $(this),
			box = $('.projects');
		if(t.data('collapse') == 'show'){
			box.animate({height: 1000}, function(){
				t.data('collapse', 'hide').text('Свернуть');
			});
		} else {
			box.animate({height: 400}, function(){
				t.data('collapse', 'show').text('Развернуть');
			});
		}
	});

	/*seo-smm box actions*/

	$('.sub-menu li').click(function(){
		if($(this).hasClass('show-seo')){
			$('.projects-wrap, .smm-box').hide();
			$('.seo-box').fadeIn();
		}
		else if($(this).hasClass('show-smm')){
			$('.projects-wrap, .seo-box').hide();
			$('.smm-box').fadeIn();
		}
		else{
			$('.seo-box, .smm-box').hide();
			$('.projects-wrap').fadeIn();
		}
	});

	$('.proj-block .projects').metafizzyFilter('.sub-menu').height(400);

	$('.sub-menu li').click(function(){
		var hideBtn = $('.hide-btn'),
			projBox = $('.projects');

		if($(this).data('optionValue') == '*'){
			if(hideBtn.data('collapse') == 'show'){
				projBox.height(400);

				/*ie fix*/
				setTimeout(function(){
					projBox.animate({height: 400});
				}, 500);
			}
			hideBtn.fadeIn();
		} else {
			hideBtn.fadeOut();
		}
	});

	$('.portfolio-element').mouseenter(function(){
		$(this).find('img').fadeOut(100);
	}).mouseleave(function(){
		$(this).find('img').fadeIn(100);
	});

	/*define state on load by the hash*/
	if(hash && hash != 'main'){
		viewModule['changeState'](hash);
	}

	/*change state button handlers*/
	$('.projects .element').click(function(e){
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

	/*project gallery prev/next button handlers*/
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
				$('html, body').scrollTop(0);
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
				$('html, body').scrollTop(0);
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
});