$(function(){
	/*accordion*/
	$('.vacancies-list .active .list-item').slideDown('slow');

	$('.accordion-btn').click(function(e){
		e.preventDefault();
		if(!$(this).parent().hasClass('active')){
			$('.vacancies-list .active .list-item').slideUp('slow', function(){
				$(this).parent().removeClass('active');
			});
			$(this).parent().find('.list-item').slideDown('slow', function(){
				$(this).parent().addClass('active');
			});
		}
	});
});