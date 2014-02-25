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

	$('.proj-block .projects').metafizzyFilter('.sub-menu').height(400);

	$('.sub-menu li').click(function(){
		var hideBtn = $('.hide-btn'),
			projBox = $('.projects');

		if($(this).data('optionValue') == '*'){
			if(hideBtn.data('collapse') == 'show'){
				projBox.height(400);
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