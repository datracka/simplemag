/* Toggle Front-End */
jQuery(document).ready(function($){
	$('.sc-accordion p, .sc-accordion .trigger').click(function(e){
		e.preventDefault();
		$(this).toggleClass('active').next().slideToggle('fast');
	});
});