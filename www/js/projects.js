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
});