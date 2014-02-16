/**
 * Projects filter
 */
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