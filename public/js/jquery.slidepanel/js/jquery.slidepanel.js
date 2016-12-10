/*************************************************
      SlidePanel JS v2.0
      @author Fabio Mangolini
      http://www.responsivewebmobile.com
**************************************************/
(function($) {
	$.SlidePanel = function(options) {
		//default status is closed
		var status = 'close';

		//initialize the panel show/hide button 
        $('#slidein-panel-btn').css({'position': 'absolute', 'top': 0, 'right':-$('#slidein-panel-btn').outerWidth()+'px'});

        //initialize the panel
        $('#slidein-panel').css({'position': 'absolute', 'top': 0, 'left': -$('#slidein-panel').outerWidth(), 'height': $(window).height()});

        //show and hide the panel depending on status
		$('#slidein-panel-btn').click(
			function() {
				if(status == 'close') {
					status = 'open';
					$('#slidein-panel').animate({'left':0});
				}
				else if(status == 'open') {
					status = 'close';
					$('#slidein-panel').animate({'left':-$('#slidein-panel').outerWidth()});
				}
			}
		);
	};
})(jQuery);