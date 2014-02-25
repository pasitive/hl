$(function(){
	/*sub menu toggle*/

	$('.sub-menu a').click(function(e){
		e.preventDefault();
		if(!$(this).parent().hasClass('selected')){
			$('.sub-menu .selected').removeClass('selected');
			$(this).parent().addClass('selected');

			if($(this).hasClass('account-details')){
				$('.projects-content').hide();
				$('.account-content').fadeIn('slow');
			}
			if($(this).hasClass('account-projects')){
				$('.account-content').hide();
				$('.projects-content').fadeIn('slow');

			}
		}
	});

	/*projects list*/

	$('.project-list a').click(function(e){
		e.preventDefault();
		$('.projects-wrap').hide();
		$('#' + $(this).data('project')).fadeIn('slow');
	});

	/*datepicker*/

	$('[name="from-date"], [name="to-date"]').datepicker();
});