/*Actors filter*/

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
	$('.actors-block .actors').metafizzyFilter('.sub-menu');
});